<template>
  <el-dialog custom-class="securityset" :visible="dialogVisible" :modify-type="modifyType" :close-on-click-modal="false" width="450px" :modal="true" @close="handleCancel">
    <div slot="title" class="dialog-title">
      <span>{{ title }}</span>
    </div>
    <el-form ref="form" :model="form" :rules="rules" :label-width="language === 'en' ? '140px' : '100px'" label-position="left">
      <el-form-item v-if="modifyType === 'phone'" :label="`${$t('Account.BindingMobilePhone')}：`" prop="telephone">
        <el-input v-model.trim="form.telephone" :maxlength="20" :placeholder="$t('PromptInfo.PleaseInputPhone')" />
      </el-form-item>
      <el-form-item v-else :label="`${$t('Account.BindingEmail')}：`" prop="email">
        <el-input v-model.trim="form.email" :maxlength="320" :placeholder="$t('PromptInfo.PleaseInputEmail')" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="dialog-footer__confirm" @click="handleConfirm">{{ $t('Common.Confirm') }}</el-button>
      <el-button @click="handleCancel">{{ $t('Operation.Cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as Validate from '@/utils/validate'
import { mapGetters } from 'vuex'
import { CheckEmail } from '@/api/user'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    modifyType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    title() {
      if (this.modifyType === 'email') {
        return this.$t('Account.ModifyBindingEmail')
      }
      return this.$t('Account.ModifyBindingMobilePhone')
    },
    rules() {
      const uniqueEmail = (rule, value, callback) => {
        if (value && this.tempEmail !== value) {
          CheckEmail({ email: value }).then(res => {
            if (res.data === 1) {
              callback(new Error(this.$t('PromptInfo.EMailIsOccupied')))
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }
      return {
        telephone: [
          { required: true, message: this.$t('PromptInfo.PleaseInputTheCorrectPhone'), trigger: 'blur' },
          { required: true, validator: Validate.validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('PromptInfo.PleaseInputTheCorrectEmail'), trigger: 'blur' },
          { validator: uniqueEmail, trigger: 'blur' },
          { required: true, validator: Validate.validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(val) {
      this.resetField()
    }
  },
  methods: {
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.$emit('onConfirm', true, this.form)
      })
    },
    handlePassword() {
      this.$set(this.form, 'comformPassword', '')
      this.$refs.form.clearValidate('comformPassword')
    },
    handleCancel() {
      // 取消只关闭弹窗，不刷新列表
      this.$emit('onConfirm', false)
      this.resetField()
    },
    resetField() {
      this.$refs.form && this.$refs.form.resetFields()
      this.form = {}
    }
  }
}
</script>

