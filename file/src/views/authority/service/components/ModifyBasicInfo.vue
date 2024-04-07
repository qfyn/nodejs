<template>
  <el-dialog :visible="dialogVisible" :close-on-click-modal="false" :width="language === 'en' ? '550px' : '450px'" :modal="true" @close="handleCancel">
    <div slot="title" class="dialog-title">
      <span>{{ $t('System.ModifyBasicInformation') }}</span>
    </div>
    <el-form ref="modifyform" :model="formData" :rules="rules" :label-width="language === 'en' ? '180px' : '80px'" label-position="left">
      <el-form-item v-if="type == 0 " :label="$t('System.AuthorizedUser')" prop="organizationName">
        <el-input v-model.trim="formData.organizationName" maxlength="100" :placeholder="$t('PromptInfo.PleaseInput')" />
      </el-form-item>
      <el-form-item v-else :label="$t('System.BusinessLicense')" prop="businessLicenseCode">
        <el-input v-model.trim="formData.businessLicenseCode" maxlength="18" :placeholder="$t('PromptInfo.PleaseInput')" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ $t('Operation.Cancel') }}</el-button>
      <el-button type="primary" class="dialog-footer__confirm" :loading="conformLoading" @click="handleConfirm">{{ $t('Operation.Confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { UpdateRegisterInfo } from '@/api/system'
import * as Validate from '@/utils/validate'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData: {},
      conformLoading: false
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      return {
        organizationName: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' }
        ],
        businessLicenseCode: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' },
          { required: true, validator: Validate.checkLicense, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.resetField()
        const data = {
          organizationName: this.baseInfo.organizationName,
          businessLicenseCode: this.baseInfo.businessLicenseCode
        }
        const params = Object.assign(this.formData, data)
        this.formData = { ...params }
      }
    }
  },

  methods: {
    handleConfirm() {
      this.$refs.modifyform.validate((valid) => {
        if (!valid) return
        this.conformLoading = true

        UpdateRegisterInfo(this.formData).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('PromptInfo.ModifySuccess')
          })
          this.$emit('onConfirm', true)
        }).catch((err) => {
          this.$message({
            type: 'error',
            message: err.msg || this.$t('PromptInfo.ModifyFailed')
          })
          this.$emit('onConfirm', false)
        }).finally(() => {
          this.conformLoading = false
        })
      })
    },
    handleCancel() {
      // 取消只关闭弹窗，不刷新列表
      this.$emit('onConfirm', false)
      this.$refs.modifyform && this.$refs.modifyform.resetFields()
      this.formData = {}
    },
    resetField() {
      this.$refs.modifyform && this.$refs.modifyform.clearValidate()
      this.formData = {
        type: 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog .el-dialog__footer .dialog-footer{
  text-align: right;
}
.el-dialog .el-dialog__footer .el-button{
  width: auto;
}
</style>

