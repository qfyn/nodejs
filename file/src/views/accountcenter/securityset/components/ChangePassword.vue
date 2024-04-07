<template>
  <el-dialog custom-class="securityset" :visible="dialogVisible" :close-on-click-modal="false" width="450px" :modal="true" @close="handleCancel">
    <div slot="title" class="dialog-title">
      <span>{{ $t('Account.ChangeThePassword') }}</span>
    </div>
    <el-form v-if="dialogVisible" ref="form" class="accountpassword" :model="form" :rules="rules" :label-width="language === 'en' ? '160px' : '100px'" label-position="left">
      <el-form-item :label="`${$t('Account.OriginalPassword')}：`" prop="password">
        <el-input v-model.trim="form.password" type="password" autocomplete="new-password" maxlength="50" show-password :placeholder="$t('PromptInfo.PleaseInputTheOriginalPassword')" />
      </el-form-item>

      <el-form-item :label="`${$t('Account.Password')}：`" prop="newPassword">
        <el-input v-model.trim="form.newPassword" type="password" autocomplete="new-password" maxlength="50" show-password :placeholder="$t('PromptInfo.PleaseInputThePassword')" @change="handlePassword" />
      </el-form-item>

      <el-form-item :label="`${$t('Account.Confirm')}：`" prop="comformPassword">
        <el-input v-model.trim="form.comformPassword" type="password" autocomplete="new-password" maxlength="50" show-password :placeholder="$t('PromptInfo.PleaseConfirmYourPassword')" />
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

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      form: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      const checkPassword = (rule, value, callback) => {
        if (value && this.form.newPassword !== value) {
          callback(new Error(this.$t('PromptInfo.TwiceDoesNotMatch')))
        } else {
          callback()
        }
      }
      return {
        password: [
          { required: true, message: this.$t('PromptInfo.PleaseInputTheOriginalPassword'), trigger: 'blur' },
          { required: true, validator: Validate.validatePsw, trigger: 'blur' },
          { min: 8, max: 50, message: this.$t('PromptInfo.EightToFiftyLength'), trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: this.$t('PromptInfo.PleaseInputThePassword'), trigger: 'blur' },
          { required: true, validator: Validate.validatePsw, trigger: 'blur' },
          { min: 8, max: 50, message: this.$t('PromptInfo.EightToFiftyLength'), trigger: 'blur' }
        ],
        comformPassword: [
          { required: true, message: this.$t('PromptInfo.PleaseConfirmYourPassword'), trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
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

