<template>
  <div class="zhd-card first">
    <div class="search-row">
      <el-button v-permit="$permitKeys.organizationMemberlist.addMember" type="primary" @click="addMember">{{ $t('Organization.AddMember') }}</el-button>
      <el-input
        ref="search-input"
        v-model.trim="pageParam.name"
        class="search-input"
        clearable
        :placeholder="$t('Organization.PleaseInputAccountName2')"
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
        :selectable="handleSelect"
      />
      <el-table-column align="center" :label="$t('Organization.AccountName')" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('Organization.ContactMobile')" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('Organization.ContactEmail')" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('Organization.ValidPeriod')" min-width="150px">
        <template slot-scope="scope">

          <span
            :class="{'running-state--expiring': scope.row.dayNum > 0 && scope.row.dayNum < 7, 'running-state--expired': scope.row.dayNum <= 0 }"
          >{{ scope.row.loseEfficacyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Organization.CreateTime')" align="center" min-width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Common.Opration')" align="center" :min-width="language === 'zh-Hans' ? '200px' : '300px' ">
        <template slot-scope="scope">
          <el-button v-permit="$permitKeys.organizationMemberlist.edit" type="text" @click="editeMember(scope.row)">{{ $t('Common.Edit') }}</el-button>
          <span class="table-operation__separator" />
          <el-button v-permit="$permitKeys.organizationMemberlist.resetPassword" type="text danger" @click="resetPassword(scope.row)">{{ $t('Organization.ResetPassword') }}</el-button>
          <span class="table-operation__separator" />
          <el-button v-permit="$permitKeys.organizationMemberlist.delete" :disabled="scope.row.id === userInfo.id" :type="scope.row.id === userInfo.id ? 'text' : 'text danger'" @click="deleteMember(scope.row)">{{ $t('Common.Delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer-row">
      <div class="ops">
        <el-checkbox v-model="selectAll" :indeterminate="isIndeterminate" @change="selectAllChange" />
        <el-button v-permit="$permitKeys.organizationMemberlist.delete" class="del" type="danger" :disabled="multipleSelection.length === 0" @click="deleteMemberList">{{ $t('Common.Delete') }}</el-button>
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
    <add-member ref="addMember" @addMember="handelAddMember" @editMember="handelEditMember" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { paginationTable } from '@/mixins/pagination'
import addMember from '../structure/comp/addMember.vue'

import { GetUserList, ResetPassword, DeleteUser, GetResetPassword } from '@/api/organization'

export default {
  name: '',
  components: {
    addMember
  },
  mixins: [paginationTable],
  data() {
    return {
      list: null,
      listLoading: true,
      selectAll: false,
      isIndeterminate: false,
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters({
      selectNodeTree: 'selectNodeTree',
      language: 'language',
      userInfo: 'userInfo'
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
        page: this.pageParam.pageIndex,
        name: this.pageParam.name
      }
      GetUserList(params).then((response) => {
        this.list = response?.data?.items || []
        this.listLoading = false
        this.totalCount = response?.data?._meta?.totalCount || 0
        this.list.forEach((item, index) => {
          const dayTime = new Date(item.loseEfficacyTime).getTime()
          const currentDay = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
          const currentTime = new Date(currentDay).getTime()
          const dayNum = (dayTime - currentTime) / (1000 * 60 * 60 * 24)
          this.list[index].dayNum = dayNum
        })
      })
    },
    onSubmit() {
      this.search()
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
    handleSelect(row, index) {
      return row.id !== this.userInfo.id
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
    // 新增成员
    addMember() {
      this.$refs.addMember.show()
    },
    handelAddMember(success, data) {
      success && this.search()
    },
    handelEditMember(success, data) {
      success && this.search()
    },
    // 编辑成员
    editeMember(row) {
      this.$refs.addMember.show(row, 2)
    },
    // 删除成员
    async deleteMember(row) {
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
        const params = list.map(item => {
          return {
            id: item.id,
            name: item.name
          }
        })
        DeleteUser(params).then(res => {
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
    // 重置密码
    async resetPassword(row) {
      GetResetPassword().then(async res => {
        const confirmResult = await this.$confirm(
          this.$t('Organization.ResetPasswordConfirm', { name: row.name, password: res.data }),
          this.$t('Common.Tips'),
          {
            confirmButtonText: this.$t('Common.Confirm'),
            cancelButtonText: this.$t('Common.Cancel'),
            type: 'warning'
          }
        ).catch((err) => err)
        if (confirmResult === 'confirm') {
          // 执行重置密码
          ResetPassword({ id: row.id }, this.userInfo.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('Organization.ResetPasswordSuccess')
            })
          }).catch((err) => {
            this.$message({
              type: 'success',
              message: err.msg || this.$t('Organization.ResetPasswordFailed')
            })
          })
        }
      })
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
.running-state--expiring{
  color: #E7B229;
}
.running-state--expired{
  color: #FF4D4F
}
</style>
