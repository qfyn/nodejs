<template>
  <div class="securityset">
    <div class="container">
      <div class="securityset-title">
        {{ $t('Account.AccountVerification') }}
      </div>
      <div class="securityset-body">
        <div class="body-item">
          <div class="body-item-title">
            <i class="el-icon-circle-check" />
            <span class="body-item-title__content">{{ $t('Account.LoginPassword') }}</span>
          </div>
          <div class="body-item-content">
            <span class="body-item-content__promptinfo">{{ $t('Account.LoginPasswordPromptInfo') }}</span>
            <el-button v-permit="$permitKeys.accountcenterSecurityset.modify" class="body-item-content__modify" type="text" @click="handleModify('password')">{{ $t('Operation.Modify') }}</el-button>
          </div>
        </div>

        <div class="body-item">
          <div class="body-item-title">
            <i class="el-icon-circle-check" />
            <span class="body-item-title__content">{{ $t('Account.MobilePhoneBinding') }}</span>
          </div>
          <div class="body-item-content">
            <span class="body-item-content__promptinfo">{{ $t('Account.MobilePhoneBindingPromptInfo', { phone: userInfo.telephone }) }}</span>
            <el-button v-permit="$permitKeys.accountcenterSecurityset.modify" class="body-item-content__modify" type="text" @click="handleModify('phone')">{{ $t('Operation.Modify') }}</el-button>
          </div>
        </div>

        <div class="body-item">
          <div class="body-item-title">
            <i class="el-icon-circle-check" />
            <span class="body-item-title__content">{{ $t('Account.AlternateMailbox') }}</span>
          </div>
          <div class="body-item-content">
            <span class="body-item-content__promptinfo">{{ $t('Account.AlternateMailboxPromptInfo', { email: userInfo.email }) }}</span>
            <el-button v-permit="$permitKeys.accountcenterSecurityset.modify" class="body-item-content__modify" type="text" @click="handleModify('email')">{{ $t('Operation.Modify') }}</el-button>
          </div>
        </div>
      </div>
    </div>

    <change-password :dialog-visible="dialogVisiblePassword" @onConfirm="onConfirmPassword" />

    <modify-contact :dialog-visible="dialogVisibleModify" :modify-type="modifyType" @onConfirm="onConfirmModify" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  UpdateTelephone,
  Updatepassword,
  UpdateEmail
} from '@/api/user'
import ChangePassword from './components/ChangePassword'
import ModifyContact from './components/ModifyContact'
import { setLoginInfo } from 'hi-fas-utils/src/permission'
import { rsaEncrypt } from 'hi-fas-utils/src/jsencrypt'

export default {
  name: 'Securityset',
  components: {
    ChangePassword,
    ModifyContact
  },
  data() {
    return {
      dialogVisiblePassword: false,
      dialogVisibleModify: false,
      modifyType: 'phone'
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },

  methods: {
    handleModify(type) {
      switch (type) {
        case 'password':
          this.dialogVisiblePassword = true
          break
        case 'phone':
          this.modifyType = 'phone'
          this.dialogVisibleModify = true
          break
        case 'email':
          this.modifyType = 'email'
          this.dialogVisibleModify = true
          break
        default:
          break
      }
    },

    // 修改邮箱或手机
    onConfirmModify(isSuccess, data) {
      this.dialogVisibleModify = false
      const params = { id: this.userInfo.id, ...data }
      if (isSuccess) {
        const UpdateData = this.modifyType === 'email' ? UpdateEmail : UpdateTelephone
        UpdateData(params).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('PromptInfo.ModifySuccess')
          })
          this.$store.dispatch('user/getInfo', { id: this.userInfo.id })
        }).catch((err) => {
          this.$message({
            type: 'error',
            message: err.msg || this.$t('PromptInfo.ModifyFailed')
          })
        })
      }
    },

    // 修改密码
    onConfirmPassword(isSuccess, data) {
      this.dialogVisiblePassword = false
      if (isSuccess) {
        const params = { ...data }
        delete params.comformPassword
        params.name = this.userInfo.name
        params.password = rsaEncrypt(params.password)
        params.newPassword = rsaEncrypt(params.newPassword)
        Updatepassword(params).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('PromptInfo.ModifySuccess')
          })
          this.$store.dispatch('user/getInfo', { id: this.userInfo.id })
          setLoginInfo({ userName: '', password: '' })
        }).catch((res) => {
          this.$message({
            type: 'error',
            message: res.msg || this.$t('PromptInfo.ModifyFailed')
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.securityset{
  &-title{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC, sans-serif;
    font-weight: 500;
    color: #2B2F36;
    height: 40px;
  }

  .body-item:not(:first-child){
    border-top: 1px solid #DADADA;
    margin-top: 18px;
    padding-top: 18px;
  }

  .body-item{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC, sans-serif;
    font-weight: 400;
    color: #2B2F36;
    &-title{
      line-height: 20px;
      height: 20px;
      .el-icon-circle-check{
        color: #63BA4D;
        vertical-align: middle;
        font-size: 16px;
      }
      .el-icon-warning-outline {
        color: $--color-primary;
        vertical-align: middle;
        font-size: 16px;
      }
      &__content{
        margin-left: 8px;
        vertical-align: middle;
      }
    }
    &-content{
      line-height: 20px;
      color: rgba($color: #2B2F36, $alpha: 0.6);
      margin-left: 24px;
      padding-bottom: 18px;
      &__promptinfo{
        width: calc(100% - 70px);
        display: inline-block;
        word-break: break-all;
      }
      &__modify{
        padding: 3px;
        font-size: 14px;
        float: right;
      }
    }
  }
}
</style>
