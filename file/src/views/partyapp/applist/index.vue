<template>
  <div class="zhd-card first">
    <div class="search-row">
      <el-button v-permit="$permitKeys.partyappApplist.add" type="primary" @click="addUser">{{ $t('Common.Add') }}</el-button>
      <el-input
        ref="search-input"
        v-model.trim="pageParam.name"
        class="search-input"
        clearable
        :placeholder="$t('PromptInfo.PleaseInputUserName')"
        :maxlength="20"
        @input="handleInput"
      />
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
      <el-table-column :label="$t('Partyapp.UserName')" min-width="180px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="appid" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.appid }}
        </template>
      </el-table-column>
      <el-table-column label="appkey" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.appkey }}
        </template>
      </el-table-column>
      <el-table-column label="appsecret" min-width="250px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.appsecret }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Partyapp.Remarks')" min-width="100px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Common.Opration')" :min-width="language === 'zh-Hans' ? '200px' : '300px' ">
        <template slot-scope="scope">
          <el-button v-permit="$permitKeys.partyappApplist.edit" type="text" @click="editUser(scope.row)">{{ $t('Common.Edit') }}</el-button>
          <span class="table-operation__separator" />
          <el-button v-permit="$permitKeys.partyappApplist.delete" class="del" type="text danger" @click="deleteUser(scope.row)">{{ $t('Common.Delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer-row">
      <div class="ops">
        <span style="display: inline-block">{{ $t('Common.selectedCount', { count: multipleSelection.length || 0 }) }}</span>
        <el-button v-permit="$permitKeys.partyappApplist.delete" class="del" type="danger" :disabled="multipleSelection.length === 0" @click="deleteMemberList">{{ $t('Common.Delete') }}</el-button>
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
    <add-user :user-info="userInfo" :is-edit="isEdit" :app-types-options="appTypesOptions" :dialog-visible="dialogVisible" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { paginationTable } from '@/mixins/pagination'
import { GetUserList, BatchDelete, GetModuleOptions } from '@/api/partyapp'
import AddUser from './components/AddUser'

export default {
  name: '',
  components: {
    AddUser
  },
  mixins: [paginationTable],
  data() {
    return {
      list: null,
      listLoading: false,
      selectAll: false,
      isIndeterminate: false,
      multipleSelection: [],
      isEdit: false,
      dialogVisible: false,
      userInfo: {},
      appTypesOptions: []
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
  async created() {
    await this.getModuleOptions()
    this.fetchData()
  },
  methods: {
    getModuleOptions() {
      return new Promise((resolve) => {
        GetModuleOptions().then(res => {
          this.appTypesOptions = res.data || []
          resolve()
        })
      })
    },
    fetchData() {
      this.listLoading = false
      const params = {
        limit: this.pageParam.pageSize,
        page: this.pageParam.pageIndex,
        name: this.pageParam.name
      }
      GetUserList(params).then(response => {
        this.list = response?.data?.items || []
        this.listLoading = false
        this.totalCount = response?.data?._meta?.totalCount || 0
      })
    },
    handleApps(row) {
      const apps = row.apps
      if (!apps) return ''
      const apptypes = apps.split(',')
      const appsLabel = []
      if (apptypes.length > 0) {
        apptypes.forEach(type => {
          this.appTypesOptions.find(item => {
            // eslint-disable-next-line
            if (item.key == type) {
              if (item.value === 'terminal') {
                appsLabel.push(`${item.value}(${this.$t('Partyapp.UpperLimitOfAccess')}：${row.terminalCount})`)
              } else if (item.value === 'station') {
                appsLabel.push(`${item.value}(${this.$t('Partyapp.UpperLimitOfAccess')}：${row.stationCount})`)
              } else {
                appsLabel.push(item.value)
              }
            }
          })
        })
      }
      return appsLabel.join(',')
    },
    search() {
      this.fetchData()
    },
    handleInput() {
      this.pageParam.pageIndex = 1
      this.search()
    },
    handleDelete(delRows) {
      this.handleDeletePageIndex(this.list.length, delRows)// 获取删除后，执行查询的页码
      this.search()
    },
    // 表格选中切换
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 新增用户
    addUser() {
      this.isEdit = false
      this.dialogVisible = true
    },
    // 编辑用户
    editUser(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.userInfo = row
    },
    // 删除用户
    async deleteUser(row) {
      this.deleteMemberList({
        params: [row]
      })
    },
    // 批量删除
    async deleteMemberList(options) {
      const { params: row } = options
      const list = row || this.multipleSelection

      if (!list || list.length === 0) {
        return this.$message({
          type: 'warning',
          message: this.$t('Partyapp.PleaseSelectOneUser')
        })
      }
      const msg = `${this.$t('Partyapp.DeleteConfirm')}：${list.map(item => { return item.name }).join(',')}？`
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
        const params = list.map(item => item.id).join(',')
        await BatchDelete({ idList: params }).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('Common.DeleteSuccess')
          })
          this.handleDelete(list.length)
        }).catch(() => {
          this.$message({
            type: 'success',
            message: this.$t('Common.DeleteFailed')
          })
        })
      }
    },
    onConfirm(success) {
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
    width: 180px;
    float: left;
    .del{
      margin-left: 15px;
    }
  }
}
</style>
