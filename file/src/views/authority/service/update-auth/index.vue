<template>
  <div class="updateauth container--bg">
    <div class="updateauth-title">
      <span>{{ $t('System.' + title) }}</span>
    </div>
    <div class="tips">
      <i class="el-icon-warning-outline" />
      <span>{{ $t('System.DssTips') }}</span>
    </div>
    <el-form ref="updateauthform" class="updateauthform" :model="formData" :rules="rules" :label-width="language === 'en' ? '180px' : '80px'" label-position="left">
      <el-form-item :label="$t('System.AuthorizedUser')" prop="company">
        <el-input v-model.trim="formData.company" :disabled="isUpdate == 1 || !!basicInfo.organizationName" maxlength="100" :placeholder="$t('PromptInfo.PleaseInput')" />
      </el-form-item>
      <el-form-item :label="$t('System.BusinessLicense')" prop="license">
        <el-input v-model.trim="formData.license" :disabled="isUpdate == 1 || !!basicInfo.businessLicenseCode" maxlength="18" :placeholder="$t('PromptInfo.PleaseInput')" @input="handelChangeRadio" />
      </el-form-item>
      <el-form-item :label="$t('System.IdentificationCode')" prop="identifyCode">
        <el-input v-model.trim="formData.identifyCode" style="width:61%" disabled :placeholder="$t('PromptInfo.PleaseClickToGenerateIdentificationCode')" />
        <el-button v-permit="$permitKeys.authorityServiceUpdateAuth.generateIdentificationCode" style="width:35%;margin-left:10px" type="primary" :loading="identificationCodeLoading" @click="handelIdentifyNum">{{ $t('System.GenerateIdentificationCode') }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('System.RegistrationCode')" prop="registrationCode">
        <el-input v-model.trim="formData.registrationCode" maxlength="24" :placeholder="$t('PromptInfo.PleaseInput')" />
      </el-form-item>
    </el-form>
    <div class="updateauth-footer">
      <el-button v-permit="$permitKeys.authorityServiceUpdateAuth.registration" type="primary" class="updateauth-footer__confirm" :loading="conformLoading" @click="handleConfirm">{{ $t('System.Registration') }}</el-button>
      <el-button v-permit="$permitKeys.authorityServiceUpdateAuth.cancel" @click="handleCancel">{{ $t('Operation.Cancel') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as Validate from '@/utils/validate'
import { PostIdentifyNum, RegisterActivate } from '@/api/system'
import { redirect } from 'hi-fas-utils/src/systemRedirect'
export default {
  name: 'UpdateAuthorization',
  data() {
    return {
      formData: {},
      conformLoading: false,
      identificationCodeLoading: false,
      title: '',
      isUpdate: false,
      serviceSystem: 'position',
      basicInfo: {},
      original_IdentifyCode: ''
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      const requiredIdentifyCode = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('PromptInfo.PleaseClickToGenerateIdentificationCode')))
        } else {
          callback()
        }
      }
      return {
        company: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' }
        ],
        license: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' },
          { required: true, validator: Validate.checkLicense, trigger: 'blur' }
        ],
        identifyCode: [
          { required: true, validator: requiredIdentifyCode, trigger: 'blur' }
        ],
        registrationCode: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' },
          { min: 24, max: 24, message: this.$t('PromptInfo.PleaseInputTwentyFourCharacters'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    language() {
      this.$nextTick(() => {
        this.$refs.updateauthform && this.$refs.updateauthform.clearValidate()
      })
    }
  },
  created() {
    const params = this.$route.params
    if (params) {
      this.isUpdate = params.isUpdate
      this.title = params.title
      this.serviceSystem = params.serviceSystem
      this.basicInfo = params.info || {}
      this.formData = {}
      this.original_IdentifyCode = this.basicInfo.identifyCode || ''
      this.$set(this.formData, 'company', this.basicInfo.organizationName)
      this.$set(this.formData, 'license', this.basicInfo.businessLicenseCode)
      this.$set(this.formData, 'identifyCode', this.basicInfo.identifyCode && this.basicInfo.identifyCode.toUpperCase())
      this.formData = { ...this.basicInfo, ...this.formData }
      delete this.formData.businessLicenseCode
      delete this.formData.organizationName
    }
    if (!params.serviceSystem) {
      this.$router.push({ name: 'ServiceAuthorization' })
    }
  },
  methods: {
    handleCancel() {
      this.$router.push({ name: 'ServiceAuthorization' })
    },
    handleConfirm() {
      this.$refs.updateauthform.validate((valid) => {
        if (!valid) return
        this.conformLoading = true
        const params = {
          ...this.formData,
          serviceSystem: this.serviceSystem,
          status: this.basicInfo.status,
          type: 0,
          identifyCode: this.original_IdentifyCode
        }
        RegisterActivate(params).then(res => {
          let subname = 'dss'
          const data = res.data || {}
          let successMsg = this.$t('System.OpeningDss')
          if (this.serviceSystem === 'position') {
            subname = 'dss'
            successMsg = this.$t('System.OpeningDss') + '，' + this.$t('System.StreamsAndTerminalCountsTips', { streamCount: data.permissionStationNum || 0, terminalCount: data.permissionTerminalNum || 0 })
          } else if (this.serviceSystem === 'station') {
            subname = 'platform'
            successMsg = this.$t('System.OpeningPlatform')
          } else if (this.serviceSystem === 'alarm') {
            subname = 'omc'
            successMsg = this.$t('System.OpeningOmc')
          }
          this.$alert(successMsg, this.$t('PromptInfo.Tips'), {
            confirmButtonText: this.$t('Operation.EnterSystemHomepage'),
            cancelButtonText: this.$t('Operation.Sure'),
            showCancelButton: true,
            type: 'success'
          }).then(() => {
            redirect({ subname })
          }).catch(() => {
            this.$router.push({ name: 'ServiceAuthorization' })
          })
        }).catch((err) => {
          const errMsg = err.msg || this.$t('PromptInfo.RegistrationFailed')
          this.$alert(errMsg, this.$t('PromptInfo.Tips'), {
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: this.$t('Operation.Sure'),
            type: 'error'
          })
        }).finally(() => {
          this.conformLoading = false
        })
      })
    },
    handelIdentifyNum() {
      this.$refs.updateauthform.validateField('license', (errorMessage) => {
        if (!errorMessage) {
          const params = {
            license: this.formData.license,
            serviceSystem: this.serviceSystem,
            type: 0
          }
          this.identificationCodeLoading = true
          PostIdentifyNum(params).then(res => {
            if (!res.data) return
            this.original_IdentifyCode = res.data
            this.$set(this.formData, 'identifyCode', res.data.toUpperCase())
            this.$refs.updateauthform && this.$refs.updateauthform.clearValidate('identifyCode')
          }).catch((err) => {
            this.original_IdentifyCode = ''

            this.$message({
              type: 'error',
              message: err.msg || this.$t('PromptInfo.GenerateIdentificationCodeFailed')
            })
          }).finally(() => {
            this.identificationCodeLoading = false
          })
        }
      })
    },
    handelChangeRadio() {
      // handelChangeRadio
    }
  }
}
</script>

<style lang="scss" scoped>
.updateauth{
  &-title{
    font-size: 16px;
    margin-bottom: 20px;
  }
  &-footer{
    .el-button{
      width: 120px;
      margin-right: 20px;
    }
  }
}
.updateauthform{
  width: 40%;
}
.tips{
  margin: 20px;
  padding: 15px;
  background-color: #ecf5ff;
  color: $--color-primary;
  font-size: 14px;
  span{
    vertical-align: middle;
  }
  .el-icon-warning-outline{
    vertical-align: middle;
    margin-right: 20px;
    font-size: 20px;
  }
}
</style>
