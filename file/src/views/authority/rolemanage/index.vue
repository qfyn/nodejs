<template>
  <div class="zhd-card first">
    <div class="search-row">
      <el-button v-permit="$permitKeys.authorityRolemanage.createRole" type="primary" @click="addRole">{{ $t('authority.CreateRole') }}</el-button>
    </div>
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="list"
      class="fas-table zhd-table"
      element-loading-text="Loading"
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column :label="$t('authority.Number')" type="index" :index="indexMethod" min-width="80px" />
      <el-table-column :label="$t('authority.RoleName')" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('authority.RoleType')" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.roleType | filterRoleType }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('authority.RoleDescription')" min-width="200px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('authority.SupportRoleApplication')" min-width="300px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row | fliterResourceInfo }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Common.Opration')" :width="'140px'">
        <template slot-scope="scope">
          <el-button v-permit="$permitKeys.authorityRolemanage.edit" type="text" @click="editeRole(scope.row)">{{ $t('Common.Edit') }}</el-button>
          <span class="table-operation__separator" />
          <el-button v-permit="$permitKeys.authorityRolemanage.delete" type="text danger" @click="deleteRole(scope.row)">{{ $t('Common.Delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer-row">
      <div class="ops">
        <el-checkbox v-model="selectAll" :indeterminate="isIndeterminate" @change="selectAllChange" />
        <el-button v-permit="$permitKeys.authorityRolemanage.delete" class="del" type="danger" :disabled="multipleSelection.length === 0" @click="deleteRoleList">{{ $t('Common.Delete') }}</el-button>
      </div>
      <el-pagination
        class="pagination"
        background
        :current-page="pageParam.pageIndex"
        :page-sizes="pageSizes"
        :page-size="pageParam.pageSize"
        :layout="pageLayout"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <add-role :role-info="roleInfo" :is-edit="isEdit" :dialog-visible="dialogVisible" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { paginationTable } from '@/mixins/pagination'
import { GetRoleList, DeleteRole, GetRoleDetails, BatchDeleteRole } from '@/api/authority'
import AddRole from './components/AddRole'
import { roleTypeOptions } from '@/utils/static-value'
import { generateTitle } from 'hi-fas-utils/src/i18n'

function handelResourceInfo(data, applications = []) {
  data.forEach(item => {
    applications.push(generateTitle(item))
    if (item?.nextLayer?.length > 0) {
      handelResourceInfo(item.nextLayer, applications)
    }
  })
  return applications.join(',')
}

export default {
  name: '',
  filters: {
    filterRoleType(roletype) {
      const roleTypeArr = roleTypeOptions()
      const role = roleTypeArr.find(item => item.value === +roletype)
      if (role) {
        return role.label
      }
      return ''
    },
    fliterResourceInfo(row) {
      if (row.roleType === 0) {
        return 'All'
      } else {
        return handelResourceInfo(row.resourceInfo || [])
      }
    }
  },
  components: {
    AddRole
  },
  mixins: [paginationTable],
  data() {
    return {
      list: null,
      listLoading: true,
      selectAll: false,
      isIndeterminate: false,
      multipleSelection: [],
      dialogVisible: false,
      roleInfo: {},
      isEdit: false
    }
  },
  computed: {
    ...mapGetters({
      selectNodeTree: 'selectNodeTree',
      language: 'language'
    })
  },
  watch: {
    'multipleSelection.length'() {
      if (this.multipleSelection.length > 0) {
        if (this.list.length === this.multipleSelection.length) {
          this.selectAll = true
          this.isIndeterminate = false
        } else {
          this.isIndeterminate = true
        }
      } else {
        this.selectAll = false
        this.isIndeterminate = false
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = false
      const params = {
        limit: this.pageParam.pageSize,
        page: this.pageParam.pageIndex
      }
      GetRoleList(params).then((response) => {
        this.list = response?.data?.items || []
        this.listLoading = false
        this.totalCount = response?.data?._meta?.totalCount || 0
      })
    },
    indexMethod(index) {
      const page = this.pageParam.pageIndex // 当前页码
      const limit = this.pageParam.pageSize // 每页条数
      return (index + 1) + (page - 1) * limit // 返回表格序号
    },
    search() {
      // this.pageParam.pageIndex = 1
      this.fetchData()
    },
    handleDelete(delRows) {
      this.handleDeletePageIndex(this.list.length, delRows)// 获取删除后，执行查询的页码
      this.search()
    },
    // 表格选中切换
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 表格底部全选按钮切换
    selectAllChange(val) {
      if (val) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleAllSelection()
      } else {
        this.$refs.table.clearSelection()
      }
    },
    // 新增
    addRole() {
      this.isEdit = false
      this.dialogVisible = true
    },
    // 编辑
    editeRole(row) {
      GetRoleDetails({ id: row.id }).then(res => {
        if (!res?.data) {
          this.$message({
            type: 'error',
            message: this.$t('PromptInfo.RoleDeleted')
          })
          this.search()
          this.dialogVisible = false
          return
        }
        this.roleInfo = res.data
        this.isEdit = true
        this.dialogVisible = true
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.message || this.$t('Common.OperationFailed')
        })
        this.search()
      })
    },
    // 删除-单个
    async deleteRole(row) {
      const msg = `${this.$t('Organization.DeleteConfirm')}：${row.name}？`
      const confirmResult = await this.$confirm(
        msg,
        this.$t('Common.Tips'),
        {
          confirmButtonText: this.$t('Common.Confirm'),
          cancelButtonText: this.$t('Common.Cancel'),
          type: 'warning',
          customClass: 'messagetips'
        }
      ).catch((err) => err)
      if (confirmResult === 'confirm') {
        DeleteRole({ id: row.id }).then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('Common.DeleteSuccess')
          })
          this.handleDelete(1)
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.message || this.$t('Common.OperationFailed')
          })
        })
      }
    },
    // 批量删除
    async deleteRoleList() {
      const list = this.multipleSelection
      if (list.length === 0) {
        return this.$message({
          type: 'warning',
          message: this.$t('Organization.PleaseSelectOneUser')
        })
      }
      const msg = `${this.$t('Organization.DeleteConfirm')}：${list.map(item => { return item.name }).join(',')}？`
      const confirmResult = await this.$confirm(
        msg,
        this.$t('Common.Tips'),
        {
          confirmButtonText: this.$t('Common.Confirm'),
          cancelButtonText: this.$t('Common.Cancel'),
          type: 'warning',
          customClass: 'messagetips'
        }
      ).catch((err) => err)
      if (confirmResult === 'confirm') {
        // 执行删除
        const params = { idList: list.map(item => { return item.id }).join(), flag: 1 }
        BatchDeleteRole(params).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('Common.DeleteSuccess')
          })
          this.handleDelete(list.length)
        }).catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('Common.DeleteFailed')
          })
        })
      }
    },
    onConfirm(success, data) {
      this.dialogVisible = false
      success && this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
.zhd-card{
  min-width: 1100px;
  margin-bottom: 20px;
}
.search-row{
  margin: 0 0 15px 0;
  .search-input{
    width: 230px;
    float: right;
  }
}
.fas-table{
  ::v-deep .el-table-column--selection .cell{
    padding-left: 10px;
  }
}
.footer-row{
  .ops{
    padding-left: 10px;
    width: 120px;
    float: left;
    .del{
      margin-left: 15px;
    }
  }
}
</style>
