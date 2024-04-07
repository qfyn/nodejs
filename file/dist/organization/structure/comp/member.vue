<template>
  <div class="sub-content">
    <div class="sub-title">{{ $t('Organization.MemberList') }}</div>
    <div class="search-row">
      <el-button v-permit="$permitKeys.organizationStructureCompMember.addMember" type="primary" @click="addMember">{{ $t('Organization.AddMember') }}</el-button>
      <el-button v-permit="$permitKeys.organizationStructureCompMember.moveInMember" type="primary" plain @click="moveInMember">{{ $t('Organization.MoveInMember') }}</el-button>
      <el-button v-permit="$permitKeys.organizationStructureCompMember.moveOutMember" type="primary" plain @click="moveOutMember">{{ $t('Organization.MoveOutMember') }}</el-button>
      <el-input
        ref="search-input"
        v-model.trim="searchName"
        class="search-input"
        suffix-icon="el-icon-search"
        clearable
        :placeholder="$t('Organization.PleaseInputAccountName')"
        :maxlength="maxValueLength"
        @input="search"
      />
    </div>
    <el-table
      v-loading="listLoading"
      class="zhd-table"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column :label="$t('Common.Name')" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Organization.DepartmentName')" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.deptName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Organization.Role')" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.roles | filterRoles }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Organization.RoleRange')" min-width="300" show-overflow-tooltip>
        <template>
          {{ $t('Organization.ViewAddModifyDownloadDeleteApprove') }}
        </template>
      </el-table-column>
    </el-table>
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
    <add-member ref="addMember" @addMember="handleAddMember" />
    <move-in-member ref="moveInMember" :dept-id="deptId" @handelMoveInMember="handelMoveMember" />
    <move-out-member ref="moveOutMember" :dept-id="deptId" @moveoutMember="handelMoveMember" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { paginationTable } from '@/mixins/pagination'
import addMember from './addMember.vue'
import moveInMember from './moveInMember.vue'
import moveOutMember from './moveOutMember.vue'
export default {
  name: '',
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
  components: {
    addMember,
    moveInMember,
    moveOutMember
  },
  mixins: [paginationTable],
  props: {
    deptId: {
      type: Number,
      default: 0
    },
    nodeTotal: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      maxValueLength: tools.config.maxValueLength,
      list: null,
      listLoading: true,
      searchName: '',
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters({
      selectNodeTree: 'selectNodeTree'
    })
  },
  watch: {
    deptId() {
      this.search()
    }
  },

  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      if (this.deptId === 0) return
      this.listLoading = true
      const params = {
        condition: 'id',
        deptId: this.deptId,
        limit: this.pageParam.pageSize,
        page: this.pageParam.pageIndex,
        name: this.searchName
      }
      tools.api.organization.GetDeptUserLIst(params).then((response) => {
        this.list = response?.data?.items || []
        this.totalCount = response?.data?._meta?.totalCount || 0
        this.listLoading = false
      }).finally(() => {
        this.listLoading = false
      })
    },
    onSubmit() {
      this.search()
    },
    search() {
      this.fetchData()
    },
    handleEdite(row) {
      this.search()
    },
    handleDelete(row) {
      this.handleDeletePageIndex(this.list.length)// 获取删除后，执行查询的页码
      this.search()
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      this.multipleSelection = val
      this.$refs.moveOutMember.setUserIds(val)
    },
    addMember() {
      this.$refs.addMember.show()
    },
    handleAddMember(success) {
      if (success) {
        this.fetchData()
        this.$emit('moveMember', true)
      }
    },
    moveInMember() {
      this.$refs.moveInMember.show()
    },
    moveOutMember() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'info',
          message: this.$t('PromptInfo.SelectMemberToBeRemoved')
        })
        return
      }
      this.$refs.moveOutMember.show()
    },
    handelMoveMember(success) {
      if (success) {
        this.fetchData()
        this.$emit('moveMember', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-content{
  padding-left: 15px;
  .search-input{
    width: 230px;
    float: right;
  }
  .sub-title{
    font-size: 16px;
    font-weight: 600;
    color: #2B2F36;
    &::before{
      content: "";
      width: 3px;
      height: 16px;
      background: $--color-primary;
      margin-right: 8px;
      margin-bottom: 3px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .search-row{
    margin: 15px 0;
  }
}
</style>
