<template>
  <z-dialog
    ref="dialog"
    :title="$t('Organization.MoveInMember')"
    :width="800"
    :loading="confirmLoadning"
    @cancel="cancel"
    @ok="ok"
  >
    <div class="filter">
      <span>{{ $t('Organization.Department') }}：</span>
      <my-department :department-id.sync="departmentId" :department-options="departmentOptions" @handleChange="handleDeptId" />
    </div>
    <el-table
      v-loading="listLoading"
      class="zhd-table"
      :data="list"
      element-loading-text="Loading"
      fit
      height="440"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column min-width="100px" :label="$t('Common.Name')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column min-width="130px" :label="$t('Organization.DepartmentName')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.deptName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Organization.Role')" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.roles | filterRoles }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Organization.RoleRange')" min-width="300px" show-overflow-tooltip>
        <template>
          {{ $t('Organization.ViewAddModifyDownloadDeleteApprove') }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="pageParam.pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageParam.pageSize"
      :layout="pageLayout"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </z-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { paginationTable } from '@/mixins/pagination'
import MyDepartment from '@/components/Department'

export default {
  name: '',
  components: {
    MyDepartment
  },
  filters: {
    filterRoles(roles) {
      const rolesName = []
      let data = ''
      if (roles.length > 0) {
        roles.forEach(item => {
          rolesName.push(item.name)
        })
        data = rolesName.join(',')
      }
      return data
    }
  },
  mixins: [paginationTable],
  props: {
    deptId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      selectDepartment: '',
      multipleSelection: [],
      userIds: [],
      departmentOptions: [],
      departmentId: '',
      confirmLoadning: false
    }
  },
  computed: {
    ...mapGetters(['departmentList'])
  },
  created() {
    if (this.departmentList.length > 0) {
      this.departmentOptions = this.departmentList.filter(item => item.id !== this.deptId)
      this.departmentId = this.departmentOptions?.[0]?.id
      this.fetchData()
    }
  },
  methods: {
    show(id) {
      if (this.departmentList.length > 0) {
        this.departmentOptions = this.departmentList.filter(item => item.id !== this.deptId)
        this.departmentId = this.departmentOptions?.[0]?.id
        this.fetchData()
        this.$refs['dialog'].show()
      }
    },
    cancel() {
      console.log('cancel')
    },
    ok() {
      if (this.deptId === 0) return

      if (this.userIds.length === 0) {
        this.$message({
          type: 'info',
          message: this.$t('PromptInfo.SelectMemberToBeMovedIn')
        })
        return
      }
      const params = {
        deptId: this.deptId,
        userIds: this.userIds
      }
      this.confirmLoadning = true
      tools.api.organization.MoveDeptUser(params).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: this.$t('PromptInfo.MoveInSucceeded')
          })
          this.$refs['dialog'].hide()
          this.$emit('handelMoveInMember', true)
        } else {
          this.$message({
            type: 'error',
            message: res.msg || this.$t('PromptInfo.MoveInFailed')
          })
          this.$emit('handelMoveInMember', false)
        }
      }).finally(() => {
        this.confirmLoadning = false
      })
    },
    fetchData() {
      if (this.departmentId === 0) return
      this.listLoading = true
      if (!Number.isInteger(this.departmentId)) {
        this.listLoading = false
        return
      }
      const params = {
        condition: 'id',
        deptId: this.departmentId,
        limit: this.pageParam.pageSize,
        page: this.pageParam.pageIndex
      }
      tools.api.organization.GetDeptUserLIst(params).then((response) => {
        this.list = response?.data?.items || []
        this.totalCount = response?.data?._meta?.totalCount || 0
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleDeptId() {
      this.search()
    },
    search() {
      this.pageParam.pageIndex = 1
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      this.multipleSelection = val
      this.userIds = []
      this.multipleSelection.forEach(item => {
        this.userIds.push(item.id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter{
  margin-bottom: 15px;
}
.pagination{
  margin-top: 15px;
}
::v-deep .el-table-column--selection .cell{
  padding-left: 10px;
  padding-right: 10px;
}
</style>
