<template>
  <div class="zhd-card first">
    <div class="platform-tree-container my-radius-scrollbar">
      <div>
        <el-input
          v-model.trim="orgName"
          clearable
          :placeholder="$t('Organization.InputOrgName')"
          suffix-icon="el-icon-search"
          style="width: 80%"
          maxlength="32"
        />
        <svg-icon :title="$t('Organization.AddDepartment')" icon-class="adddepartment" class="add-button" @click="showAddDepartment" />
      </div>
      <el-tree
        ref="tree"
        class="my-tree"
        :data="treedata"
        :props="defaultProps"
        highlight-current
        :expand-on-click-node="false"
        :default-expanded-keys="treeExpendKeys"
        node-key="id"
        :filter-node-method="filterNode"
        @node-click="treeClick"
        @node-expand="treeExpand"
        @node-collapse="handleNodeCollapse"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span
            class="node-label"
            :icon="data.icon"
            :bold="data.bold"
            :title="node.label + `${data.total ? '('+ data.total +')' : ''}`"
          >{{ node.label }}{{ `${data.total ? '('+ data.total +')' : ''}` }}</span>
          <span>
            <i
              class="delete-button el-icon-delete"
              :title="$t('Common.Delete')"
              @click.stop="deleteItem(data)"
            />
          </span>
        </span>
      </el-tree>
    </div>
    <div class="platform-editor">
      <department :level="selectLevel" @updateTree="handelUpdate" />
      <el-divider />
      <member :dept-id="deptId" :node-total="nodeTotal" @moveMember="handelUpdate" />
    </div>
    <add-department ref="addDepartment" @adddept="handelAdddept" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import department from './comp/department.vue'
import member from './comp/member.vue'
import addDepartment from './comp/addDepartment.vue'
import { DeleteDept } from '@/api/organization'
export default {
  name: '',
  components: {
    department,
    member,
    addDepartment
  },
  data() {
    return {
      orgName: '',
      orgList: [],
      selectLevel: 1,
      defaultProps: {
        children: 'children',
        label: 'deptSimpleName'
      },
      treeExpendKeys: [],
      deptId: 1,
      nodeTotal: 0 // 当前点击的节点的总成员数
    }
  },
  computed: {
    ...mapGetters({
      treedata: 'organizationTree',
      selectNodeTree: 'selectNodeTree'
    })
  },
  watch: {
    orgName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getOrgTree()
  },

  methods: {
    getOrgTree() {
      this.$store.dispatch('organization/getOrgTree').then(() => {
        this.setCurrentTreeNode()
        if (this.treedata && this.treedata[0]?.children[0]?.id) {
          this.selectLevel = 2
        }
        this.defaultData()
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.deptSimpleName.indexOf(value) !== -1
    },
    defaultData() {
      if (this.treedata.length > 0 && this.treeExpendKeys.length === 0) {
        this.treeExpendKeys.push(this.treedata[0].id)
        this.deptId = this.treedata[0]?.children[0]?.id || this.treedata[0].id
      }
    },
    // 属性控件节点被点击时的回调方法
    async treeClick(data, node) {
      this.nodeTotal = data.total
      this.deptId = data.id
      this.selectLevel = data.layer
      data.parentId = node.parent.data.id
      this.$store.commit('organization/SET_SELECTNODETREE', data)
    },
    // 节点展开
    treeExpand(data) {
      this.treeExpendKeys.push(data.id)
    },
    handleNodeCollapse(data) {
      const index = this.treeExpendKeys.indexOf(data.id)
      this.treeExpendKeys.splice(index, 1)
      if (data?.children?.length) {
        data.children.forEach(item => {
          this.handleNodeCollapse(item)
        })
      }
    },
    // 设置当前选中的树节点
    setCurrentTreeNode(setId) {
      this.$nextTick(() => {
        const id = setId || (this.treedata ? (this.treedata[0]?.children[0]?.id || this.treedata[0].id) : null)
        this.deptId = id
        this.$refs['tree'].setCurrentKey(id)
        const data = this.$refs['tree'].getCurrentNode(id)
        this.$store.commit('organization/SET_SELECTNODETREE', data)
      })
    },
    // 删除当前选中的节点后，重新选择节点
    reSelectNode(id) {
      let res = null
      const findParent = function(list, parent) {
        if (!Array.isArray(list)) return
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          if (element.id === id) {
            res = parent
            break
          }
          findParent(element.children, element)
        }
      }
      findParent(this.treedata)
      if (res) {
        this.deptId = res.id
        this.$refs['tree'].setCurrentKey(res.id)
        this.$store.commit('organization/SET_SELECTNODETREE', res)
        this.selectLevel = res.layer
      }
    },
    async deleteItem(data) {
      if (data.layer === 1) {
        return this.$message({
          type: 'warning',
          message: this.$t('Organization.OrgDoNotDelete')
        })
      }
      if (data?.total > 0 || data?.children?.length > 0) {
        return this.$message({
          type: 'warning',
          message: this.$t('PromptInfo.DepartmentsVannotDeleted')
        })
      }
      const confirmResult = await this.$confirm(
        `${this.$t('Organization.DeleteDepartmentAsk')}：${data.deptSimpleName} ？`,
        this.$t('Common.Tips'),
        {
          confirmButtonText: this.$t('Common.Confirm'),
          cancelButtonText: this.$t('Common.Cancel'),
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult === 'confirm') {
        try {
          DeleteDept({ id: data.id }).then(async res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('Common.DeleteSuccess')
              })
              if (data.id === this.selectNodeTree.id) {
                this.reSelectNode(data.id)
              }
              await this.$store.dispatch('organization/getOrgTree')
              this.defaultData()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err.msg
            })
          })
        } catch {
          //
        }
      }
    },

    async handelUpdate(success, data) {
      if (success) {
        await this.$store.dispatch('organization/getOrgTree').then(res => {
          if (data?.id) {
            this.setCurrentTreeNode(data.id)
            if (data?.parentId) {
              const index = this.treeExpendKeys.indexOf(data.id)
              index === -1 && this.treeExpendKeys.push(data.parentId)
            }
          } else {
            this.setCurrentTreeNode(this.deptId)
          }
          this.$refs.tree.filter(this.orgName)
        })
      }
    },

    handleSelect(val) {
      const plt = this.treedata[0]?.children?.find(item => { return item.id === val.id })
      this.selectLevel = 2
      this.$store.commit('organization/SET_SELECTNODETREE', plt)
      this.setCurrentTreeNode(plt.id)
    },
    handleSearchClear() {
      try {
        this.$refs['search-input'].$refs['input'].blur()
      } catch {
        //
      }
    },
    // 新增部门
    showAddDepartment() {
      this.$refs.addDepartment.show(this.selectNodeTree)
    },
    handelAdddept(success, data) {
      if (success) {
        const index = this.treeExpendKeys.indexOf(data.id)
        index === -1 && this.treeExpendKeys.push(data.parentId)
      }
      this.getOrgTree()
      this.orgName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.zhd-card{
  min-width: 1100px;
}
.platform-tree-container,
.platform-editor {
  display: inline-block;
  position: relative;
  vertical-align: top;
  .my-tree{
    margin-top: 15px;
    overflow: auto;
    flex: 1;
    height: calc(100% - 47px);
  }
  .add-button {
    margin-left: 10px;
    font-size: 20px;
    line-height: 32px;
    vertical-align: middle;
    cursor: pointer;
    &:hover{
      color: #4980ff;
    }
  }
}
.platform-tree-container {
  width: 251px;
  height: 760px;
  overflow: auto;
  border-right: 1px solid #e4e7ed;
  .node-label {
    max-width: 140px;
  }
}
.platform-editor {
  padding-left: 10px;
  width: calc(100% - 251px);
  min-height: 760px;
}
.custom-tree-node{
  .delete-button{
    visibility: hidden;
    cursor: pointer;
    color: #f56c6c;
    margin-left: 5px;
  }
  &:hover .delete-button{
    visibility: visible;
  }
}
::v-deep .el-tree>.el-tree-node {
  display: inline-block;
  min-width: 100%;
}
</style>

