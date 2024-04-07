<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    :width="language === 'en' ? '580px' : '450px'"
    :modal="true"
    @close="handleCancel"
  >
    <div slot="title" class="dialog-title">
      <span>{{ $t('Common.Add') }}</span>
    </div>
    <el-form ref="userform" :model="formData" :rules="rules" :label-width="language === 'en' ? '170px' : '105px'" label-position="left">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :label="`${$t('Partyapp.UserName')}：`" prop="name">
            <el-input v-model.trim="formData.name" :disabled="isEdit" maxlength="32" :placeholder="$t('PromptInfo.PleaseInput')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`appid：`" prop="appid">
            <el-input v-model.trim="formData.appid" :disabled="isEdit" maxlength="32" :placeholder="$t('PromptInfo.PleaseInput')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="form-no-need" :label="`${$t('Partyapp.Remarks')}：`">
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ $t('Operation.Cancel') }}</el-button>
      <el-button type="primary" :loading="conformLoading" class="dialog-footer__confirm" @click="handleConfirm">{{ $t('Common.Confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { AddUser, UpdateUser, CheckUser } from '@/api/partyapp'

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
    userInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    appTypesOptions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      formData: {
        appTypes: []
      },
      conformLoading: false,
      tempName: '',
      checkList: []
    }
  },
  computed: {
    ...mapGetters({
      language: 'language'
    }),
    rules() {
      const uniqueName = (rule, value, callback) => {
        if (value && this.tempName !== value) {
          CheckUser({ name: value }).then(res => {
            if (res.msg !== 'OK') {
              callback(new Error(this.$t('PromptInfo.UserNameIsAlreadyOccupied')))
            } else {
              callback()
            }
          }).catch(() => {
            callback(new Error(this.$t('PromptInfo.UserNameIsAlreadyOccupied')))
          })
        } else {
          callback()
        }
      }
      return {
        name: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' },
          { min: 1, max: 32, message: this.$t('PromptInfo.OneToThirtyTwoLength'), trigger: 'blur' },
          { validator: uniqueName, trigger: 'blur' }
        ],
        appid: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(val) {
      this.$nextTick(() => {
        this.$refs.userform && this.$refs.userform.clearValidate()
      })
      if (val && this.isEdit) {
        this.formData = { ...this.userInfo }
        this.tempName = this.formData.name
      } else {
        this.formData = {}
        this.tempName = ''
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('onConfirm', false)
    },
    handleConfirm(bool) {
      this.$refs.userform.validate(async(valid) => {
        if (!valid) return

        this.conformLoading = true
        const handelSubmit = this.isEdit ? UpdateUser : AddUser

        await handelSubmit(this.formData).then(res => {
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
        })
        this.conformLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog{
  position: relative;
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
::v-deep .form-no-need{
  .el-form-item__label{
    padding-left: 10px;
  }
}
</style>
