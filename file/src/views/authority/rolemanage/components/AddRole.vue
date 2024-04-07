<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    :width="language === 'en' ? '750px' : '650px'"
    :modal="true"
    @close="handleCancel"
  >
    <div slot="title" class="dialog-title">
      <span>{{ $t('authority.CreateRole') }}</span>
    </div>
    <el-form ref="roleform" :model="formData" :rules="rules" :label-width="language === 'en' ? '145px' : '105px'" label-position="left">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="`${$t('authority.RoleName')}：`" prop="name">
            <el-input v-model.trim="formData.name" maxlength="32" :placeholder="$t('PromptInfo.PleaseInput')" />
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('authority.RoleType')}：`" prop="roleType">
            <el-select v-model="formData.roleType" :placeholder="$t('PromptInfo.PleaseSelect')">
              <el-option
                v-for="item in roleTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`${$t('authority.RoleDescription')}：`" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              maxlength="255"
              :autosize="{ minRows: 3, maxRows: 3}"
              :placeholder="$t('PromptInfo.PleaseInput')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      size="medium"
      height="360px"
      default-expand-all
      :tree-props="{children: 'nextLayer', hasChildren: 'hasChildren'}"
    >
      <el-table-column :label="$t('authority.AuthorizedApplication')">
        <template slot-scope="scope">
          {{ generateTitle(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('authority.Visible')" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            :active-color="primaryColor"
            inactive-color="#DCDFE6"
            @change="handleSwitchChange(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ $t('Operation.Cancel') }}</el-button>
      <el-button type="primary" :loading="conformLoading" class="dialog-footer__confirm" @click="handleConfirm">{{ $t('Common.Confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetResourceList, AddRole, UpdateRole, CheckRoleName } from '@/api/authority'
import { roleTypeOptions } from '@/utils/static-value'
import * as Validate from '@/utils/validate'
import { generateTitle } from 'hi-fas-utils/src/i18n'
import { primaryColor } from 'hi-fas-components/styles/theme/variables.scss'

export default {
  name: '',
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    roleInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      formData: {},
      tableData: [],
      resourceIds: [],
      conformLoading: false,
      tableDataOringe: [],
      primaryColor
    }
  },
  computed: {
    ...mapGetters({
      language: 'language'
    }),
    rules() {
      const uniqueName = (rule, value, callback) => {
        if (value && this.tempName !== value) {
          CheckRoleName({ name: value }).then(res => {
            if (res.msg !== 'OK') {
              callback(new Error(this.$t('PromptInfo.RoleNameIsAlreadyOccupied')))
            } else {
              callback()
            }
          }).catch(() => {
            callback(new Error(this.$t('PromptInfo.RoleNameIsAlreadyOccupied')))
          })
        } else {
          callback()
        }
      }
      return {
        name: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' },
          { min: 1, max: 32, message: this.$t('PromptInfo.OneToThirtyTwoLength'), trigger: 'blur' },
          { validator: Validate.validateSpecial, trigger: 'blur' },
          { validator: uniqueName, trigger: 'blur' }
        ],
        roleType: [
          { required: true, message: this.$t('PromptInfo.PleaseSelect'), trigger: 'change' }
        ]
      }
    },
    roleTypeOptions() {
      const roleArr = roleTypeOptions()
      return roleArr.splice(1)
    }
  },
  watch: {
    dialogVisible(val) {
      this.$refs.roleform && this.$refs.roleform.clearValidate()
      if (val) {
        if (this.isEdit) {
          this.formData = { ...this.roleInfo }
          this.resourceIds = this.formData?.resourceIds || []
          this.tempName = this.formData.name
          if (this.formData?.resourceIds?.length > 0) {
            this.tableData = JSON.parse(JSON.stringify(this.tableDataOringe))
            this.tableData = this.handelEditStatus(this.tableData)
          }
        } else {
          this.formData = {}
          this.$nextTick(() => {
            this.tableData = JSON.parse(JSON.stringify(this.tableDataOringe))
          })
          this.tempName = ''
          this.resourceIds = []
        }
      } else {
        this.formData = {}
        this.tableData = []
        this.$refs.roleform && this.$refs.roleform.clearValidate()
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.tableDataOringe = []
      await GetResourceList().then(res => {
        this.tableData = this.handelDefaultStatus(res?.data || [])
        this.tableDataOringe = JSON.parse(JSON.stringify(this.tableData))
      })
    },
    // 给table添加status,防止数据变化后表格自动展开
    handelDefaultStatus(data) {
      data.forEach(item => {
        const status = 0
        this.$set(item, 'status', status)
        if (item?.nextLayer?.length > 0) {
          this.handelDefaultStatus(item.nextLayer)
        }
      })
      return data
    },

    handelEditStatus(data) {
      data.forEach(item => {
        const resourceId = this.formData.resourceIds.find(element => +element === item.id)
        const status = resourceId ? 1 : 0
        this.$set(item, 'status', status)
        if (item?.nextLayer?.length > 0) {
          this.handelEditStatus(item.nextLayer)
        }
      })
      return data
    },
    handleCancel() {
      this.$emit('onConfirm', false)
    },
    handleConfirm(bool) {
      this.$refs.roleform.validate((valid) => {
        if (!valid) return

        this.formData.resourceIds = Array.from(new Set(this.resourceIds))
        if (this.resourceIds.length === 0) {
          this.$message({
            type: 'indo',
            message: this.$t('PromptInfo.LeasrOneApplicationIsVisible')
          })
          return
        }
        this.conformLoading = true
        const handelSubmit = this.isEdit ? UpdateRole : AddRole

        handelSubmit(this.formData).then(res => {
          if (+res.code === 200) {
            this.$message({
              type: 'success',
              message: this.$t('PromptInfo.SaveSuccess')
            })
            this.$emit('onConfirm', true)
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
            this.$emit('onConfirm', false)
          }
        }).catch((err) => {
          this.$message({
            type: 'error',
            message: err.message
          })
          this.$emit('onConfirm', false)
        }).finally(() => {
          this.conformLoading = false
        })
      })
    },

    // 开关
    handleSwitchChange(data) {
      this.resourceIds = []
      if (data.status) {
        this.handelSwitch(data)
        this.handleParentSwitch(this.tableData, data)
        this.getResourceIds(this.tableData)
      } else {
        this.handelSwitch(data)
        this.handleOffSwitch(data)
      }
    },

    // 选中父级节点，子级节点都被选中
    handelSwitch(data, item = {}) {
      if (data?.nextLayer?.length) {
        data.nextLayer.forEach(item => {
          this.$set(item, 'status', data.status)
          if (item?.nextLayer?.length) {
            this.handelSwitch(item)
          }
        })
      }
    },

    // 处理父级节点
    handleParentSwitch(tableData, data) {
      tableData.forEach(item => {
        if (data.parentId === item.id || data.systemId === item.id) {
          this.$set(item, 'status', data.status)
        }
        item?.nextLayer?.length && this.handleParentSwitch(item.nextLayer, data)
      })
    },

    // 获取选中的节点的id
    getResourceIds(tableData) {
      tableData.forEach(item => {
        if (item?.nextLayer?.length) {
          const arr = item.nextLayer.find(ele => ele.status === 1)
          if (arr) {
            this.$set(item, 'status', 1)
            this.resourceIds.push(item.id)
          } else {
            this.$set(item, 'status', 0)
          }
          this.getResourceIds(item.nextLayer)
        } else {
          if (item.status) this.resourceIds.push(item.id)
        }
      })
    },

    // 移除id
    removeResourceIds(data) {
      const index = this.resourceIds.indexOf(data.id)
      index && this.resourceIds.splice(index, 1)
    },

    // 关闭开关
    handleOffSwitch(data) {
      this.getResourceIds(this.tableData)
    },

    generateTitle
  }
}
</script>

<style lang="scss" scoped>
.el-dialog{
  position: relative;
}
::v-deep .el-table--border td, ::v-deep .el-table--border th{
  border-right: none
}
::v-deep .el-dialog {
  .el-dialog__body {
    padding: 20px 32px 0px 32px;
  }
  .el-dialog__footer {
    padding: 0px 32px 20px 32px;
    .dialog-footer{
      text-align: right;
    }
  }
}
::v-deep .el-table thead{
  color: #282828;
}
::v-deep .el-table th > .cell{
  font-weight: 500;
}
</style>
