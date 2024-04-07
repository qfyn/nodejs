<template>
  <div class="zhd-card appmanage">
    <div class="appmanage-left my-radius-scrollbar">
      <div class="appmanage-left-search">
        <el-button v-if="false" v-permit="$permitKeys.authorityAppmanage.addSubsystem" class="appmanage-left-search__btn" type="primary" @click="handleAddMenu({level: 0, data: {id: 0}})">{{ $t('authority.AddSubsystem') }}</el-button>
      </div>
      <el-divider />
      <el-tree
        ref="tree"
        class="my-tree"
        :data="treeData"
        :props="defaultProps"
        :default-expanded-keys="expandedList"
        node-key="id"
        highlight-current
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
      >
        <span slot-scope="{ node }" class="custom-tree-node">
          <span
            class="node-label"
            :title="generateTitle(node.data)"
          >{{ generateTitle(node.data) }}</span>
          <span v-if="false">
            <span v-if="node.level === 1" :title="$t('Common.Add')" class="my-tree__span" @click="handleAddMenu(node)" @click.stop="handleClickStop">
              <svg-icon icon-class="icon_plus" />
            </span>
            <span v-else-if="node.level === 2 && node.data.path !== '/'" :title="$t('Common.Add')" class="my-tree__span" @click="handleAddMenu(node)" @click.stop="handleClickStop">
              <svg-icon icon-class="icon_plus" />
            </span>
            <span :title="$t('Common.Delete')" class="my-tree__span" @click="handleDeleteMenu(node)" @click.stop="handleClickStop">
              <svg-icon icon-class="icon_delete" />
            </span>
          </span>
        </span>
      </el-tree>
    </div>
    <div v-loading="menuInfoLoading" class="appmanage-right">
      <menu-form v-show="showMenuInfo" ref="menuForm" :active="active" :current-node-level="currentNodeLevel" @onConfirm="onConfirm" />
    </div>

    <add-menu ref="addMenu" class="addmenu" :dialog-visible="dialogVisible" :node-info="nodeInfo" :add-node-level="addNodeLevel" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import MenuForm from './components/MenuForm'
import AddMenu from './components/AddMenu'
import { GetResourceList, DeleteResource, GetResourceRetails
} from '@/api/authority'
import { generateTitle } from 'hi-fas-utils/src/i18n'
export default {
  name: '',
  components: {
    MenuForm,
    AddMenu
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'nextLayer',
        label: 'name'
      },
      nodeData: {},
      rules: {},
      currentNodeLevel: 1,
      dialogVisible: false,
      addNodeLevel: 2,
      showMenuInfo: false,
      nodeInfo: {},
      menuInfoLoading: false,
      menuInfoId: null,
      expandedList: [],
      currentAddParentId: null,
      active: 'modify'
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      GetResourceList().then(res => {
        this.treeData = res?.data || []
        if (this.treeData.length > 0 && this.expandedList.length === 0) {
          this.expandedList.push(this.treeData[0].id)
        }
      })
    },

    // 属性控件节点被点击时的回调方法
    handleNodeClick(data, node, nodeArr) {
      this.menuInfoLoading = true
      this.menuInfoId = data.id
      GetResourceRetails({ id: data.id }).then(res => {
        if (!res?.data) {
          this.$message({
            type: 'error',
            message: this.$t('PromptInfo.AppDeleted')
          })
          this.fetchList()
          this.showMenuInfo = true
          return
        }
        this.showMenuInfo = true
        this.currentNodeLevel = node.level
        const menuInfo = res.data
        menuInfo.parentName = node.parent.data.name
        menuInfo.parentData = node.parent.data

        this.$refs.menuForm.getFormData(menuInfo)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message
        })
        this.fetchList()
      }).finally(() => {
        this.menuInfoLoading = false
      })
    },

    getSortData(currentRoot, data = []) {
      currentRoot.forEach((item, index) => {
        if (item.layer === 1) {
          data.push({
            id: item.id,
            resourceOrder: item.resourceOrder
          })
        } else {
          data.push({
            id: item.id,
            resourceOrder: index
          })
        }
        if (item.nextLayer?.length) {
          this.getSortData(item.nextLayer, data)
        }
      })
      return data
    },

    // 防止冒泡
    handleClickStop(event) {
      event.stopPropagation()
    },
    handleAddMenu(node) {
      this.addNodeLevel = node.level + 1
      this.nodeInfo.parentId = node.data.id
      this.currentAddParentId = node.data.id
      this.nodeInfo.layer = node.level + 1
      if (node.level === 1) {
        // 子系统添加一级菜单，则将子系统的id作为系统id
        this.nodeInfo.systemId = node.data.id
        this.nodeInfo.parentName = node.data.name
      } else if (node.level > 1) {
        // 一级菜单添加二级菜单，则直接获取一级菜单的系统id
        this.nodeInfo.systemId = node.data.systemId
        this.nodeInfo.parentName = node.data.name
      }

      this.dialogVisible = true
      this.active = 'add'
    },
    handleDeleteMenu(node) {
      if (!node?.data?.id) return

      this.$confirm(this.$t('PromptInfo.ConfirmDeletePage', { page: node.data.name }), this.$t('PromptInfo.Tips'), {
        type: 'warning'
      }).then(async() => {
        DeleteResource({ id: node.data.id, layer: node.data.layer }).then(res => {
          this.deleteId(node.data)
          this.$message({
            type: 'success',
            message: this.$t('PromptInfo.DeletedSuccessfully')
          })
          // 如果当前显示的是删除的菜单所包含的数据，则隐藏右侧数据
          if (node.data.id === this.menuInfoId || node.data?.nextLayer?.find(item => item.id === this.menuInfoId)) this.showMenuInfo = false
          this.fetchList()
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.msg
          })
        })
      })
    },
    onConfirm(isSuccess) {
      this.dialogVisible = false
      this.active = 'modify'
      if (isSuccess) {
        this.currentAddParentId && this.handleNodeExpand({ id: this.currentAddParentId })
        this.currentAddParentId = null
        this.fetchList()
      }
    },
    handleNodeExpand(data, node) {
      const index = this.expandedList.indexOf(data.id)
      if (index === -1) this.expandedList.push(data.id)
    },
    handleNodeCollapse(data, node) {
      const index = this.expandedList.indexOf(data.id)
      this.expandedList.splice(index, 1)
      if (data?.nextLayer?.length) {
        data.nextLayer.forEach(item => {
          this.handleNodeCollapse(item)
        })
      }
    },
    deleteId(data) {
      this.handleNodeCollapse(data)
      if (data?.nextLayer?.length > 0) {
        data.nextLayer.forEach(item => {
          this.deleteId(item)
        })
      }
    },

    generateTitle(data) {
      return generateTitle(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.zhd-card{
  min-width: 1100px;
  height: calc(100% - 40px);
}
.appmanage{
  padding: 0;
  margin: 20px;
  &-left, &-right{
    display: inline-block;
    position: relative;
    vertical-align: top;
  }
  &-left {
    width: 262px;
    height: 100%;
    overflow: auto;
    border-right: 1px solid #e4e7ed;
    .my-tree{
      ::v-deep .el-tree-node__expand-icon{
        margin-left: 10px;
      }
      ::v-deep .el-tree-node__content{
        cursor: default;
      }
      ::v-deep .custom-tree-node .node-label::before{
        display: none;
      }
      &__span{
        margin-left: 7px;
        cursor: pointer;
      }
      .custom-tree-node{
        padding-right: 16px;
      }
    }
    .node-label {
      max-width: 140px;
    }
    &-search{
      padding: 16px;
      &__btn{
        width: 100%;
      }
    }
  }
  &-right {
    padding: 23px 30px;
    width: calc(100% - 262px);
    height: 100%;
    &-form{
      width: 40%;
    }
  }
}

.el-divider--horizontal{
  margin: 0;
}

::v-deep .my-tree.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  background-color: rgba(228, 242, 255, 1);
}

</style>

