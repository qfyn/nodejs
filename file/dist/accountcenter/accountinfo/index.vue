<template>
  <div class="container information">
    <div class="carditem accountinfo">
      <div class="carditem-title">
        {{ $t('Account.AccounInformation') }}
      </div>
      <div class="carditem-body">
        <el-form
          ref="baseInfoForm"
          :label-width="language === 'en' ? '135px' : '80px'"
          label-user-info="left"
          :model="userInfo"
          class="formincard"
        >
          <el-form-item :label="$t('Account.AccountName')">
            <span>{{ userInfo.name }}</span>
          </el-form-item>
          <el-form-item :label="$t('Account.RegistrationTime')">
            <span>{{ userInfo.createTime }}</span>
          </el-form-item>
          <el-form-item :label="$t('Account.ContactMobile')">
            <span>{{ userInfo.telephone }}</span>
          </el-form-item>
          <el-form-item :label="$t('Account.ContactEmail')">
            <span class="email">{{ userInfo.email }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="carditem carditem-topstyle">
      <div class="carditem-title">
        {{ $t('Account.ContactInformation') }}
      </div>
      <div class="carditem-body">
        <el-form
          ref="userInfoForm"
          v-loading="loading"
          :label-width="language === 'en' ? '135px' : '80px'"
          label-user-info="left"
          :model="userInfo"
          class="formincard"
          :rules="rules"
          hide-required-asterisk
        >
          <el-form-item :label="$t('Account.Country')" prop="countryCode">
            <el-select v-model="userInfo.countryCode" :placeholder="$t('PromptInfo.PleaseSelectCountry')" @change="handleSelectCountry(userInfo.countryCode)">
              <el-option
                v-for="(item) in countryOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('Account.Province')" prop="provinceCode">
            <el-select v-model="userInfo.provinceCode" filterable :disabled="!userInfo.countryCode" :placeholder="$t('PromptInfo.PleaseSelectProvince')" @change="handleSelectProvince(userInfo.provinceCode)">
              <el-option
                v-for="item in provinceOptions"
                :key="item.id"
                :label="item.name || item.nameChina"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('Account.City')" prop="cityCode">
            <el-select v-model="userInfo.cityCode" filterable :disabled="!userInfo.provinceCode" :placeholder="$t('PromptInfo.PleaseSelectCity')">
              <el-option v-for="item in cityOptions" :key="item.id" :label="item.cityName || item.name || item.nameChina" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('Account.StreetAddress')" prop="address">
            <el-input v-model.trim="userInfo.address" class="textarea" type="textarea" maxlength="255" :placeholder="$t('PromptInfo.PleaseInputStreetAddress')" clearable />
          </el-form-item>
          <el-form-item :label="$t('Account.Telephone')" prop="contactNumber">
            <el-input v-model.trim="userInfo.contactNumber" maxlength="13" :placeholder="$t('PromptInfo.PleaseInputTelephone')" clearable />
          </el-form-item>
          <el-form-item :label="$t('Account.FaxNumber')" prop="faxNumber">
            <el-input v-model.trim="userInfo.faxNumber" maxlength="20" :placeholder="$t('PromptInfo.PleaseInputFaxNumber')" clearable />
          </el-form-item>
          <el-form-item>
            <el-button v-permit="$permitKeys.accountcenterAccountinfo.save" type="primary" @click="submitFun">{{ $t('Operation.Save') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetCountry, GetProvince, GetCity, UpdateContactinfo } from '@/api/user'
import * as Validate from '@/utils/validate'
export default {
  data() {
    return {
      countryOptions: [],
      provinceOptions: [],
      cityOptions: [],
      userInfo: {},
      loading: false
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      return {
        countryCode: [
          { required: true, message: this.$t('PromptInfo.PleaseSelectCountry'), trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: this.$t('PromptInfo.PleaseSelectProvince'), trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: this.$t('PromptInfo.PleaseSelectCity'), trigger: 'change' }
        ],
        address: [
          { required: true, message: this.$t('PromptInfo.PleaseInputStreetAddress'), trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: this.$t('PromptInfo.PleaseInputTelephone'), trigger: 'blur' },
          { validator: Validate.validatePhone, trigger: 'blur' }
        ],
        faxNumber: [
          { required: true, message: this.$t('PromptInfo.PleaseInputFaxNumber'), trigger: 'blur' },
          { validator: Validate.validateFax, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    language() {
      this.getCountry()
    }
  },

  created() {
    // 页面跳转不会重新执行computed
    this.userInfo = { ...this.$store.getters.userInfo }
    this.getCountry()
  },

  methods: {
    getCountry(isUpdate) {
      this.loading = true
      GetCountry().then((res) => {
        this.countryOptions = res?.data || []
        if (!res?.data?.length) {
          this.loading = false
          return
        }
        if (this.userInfo.countryCode !== 0 && !this.userInfo.countryCode) {
          this.$set(this.userInfo, 'countryCode', this.countryOptions?.[0]?.id)
        } else {
          this.$set(this.userInfo, 'countryCode', this.userInfo.countryCode)
        }
        this.getProvince(this.userInfo.countryCode)
      }).catch(() => {
        this.loading = false
      })
    },
    getProvince(countryCode) {
      GetProvince({ countryId: countryCode }).then((res) => {
        this.provinceOptions = res?.data || []
        if (!res?.data?.length) {
          this.loading = false
          return
        }
        this.$set(this.userInfo, 'provinceCode', this.userInfo.provinceCode || this.provinceOptions?.[0]?.id)
        this.getCity(this.userInfo.provinceCode)
      }).catch(() => {
        this.loading = false
      })
    },
    getCity(provinceCode) {
      GetCity({ id: provinceCode }).then(res => {
        this.cityOptions = res?.data || []
        if (!res?.data?.length) {
          this.loading = false
          return
        }
        this.$set(this.userInfo, 'cityCode', this.userInfo.cityCode || this.cityOptions?.[0]?.id)
      }).finally(() => {
        this.loading = false
      })
    },

    // 选择国家则清空省份和城市
    handleSelectCountry(countryCode) {
      this.$set(this.userInfo, 'provinceCode', null)
      this.provinceOptions = []
      this.$set(this.userInfo, 'cityCode', null)
      this.cityOptions = []
      this.$nextTick(() => {
        this.$refs.userInfoForm.clearValidate(['provinceCode', 'cityCode'])
      })
      this.getProvince(countryCode)
    },

    // 选择省份则清空城市
    handleSelectProvince(provinceCode) {
      this.$set(this.userInfo, 'cityCode', null)
      this.cityOptions = []
      this.$nextTick(() => {
        this.$refs.userInfoForm.clearValidate('cityCode')
      })
      if (!provinceCode) {
        return
      }
      this.getCity(provinceCode)
    },
    submitFun() {
      this.$refs.userInfoForm.validate((valid) => {
        if (!valid) return

        UpdateContactinfo(this.userInfo).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('PromptInfo.SaveSuccess')
          })
          this.$store.dispatch('user/getInfo', { id: this.userInfo.id })
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.msg || this.$t('Common.EditFailed')
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.accountinfo{
  .el-form-item{
    margin-bottom: 8px;
  }
}
.carditem-body{
  margin-left: 16px;
}

.email{
  word-break: break-all;
  line-height: 20px;
  display: inline-block;
}

.formincard{
  ::v-deep .el-form-item__label{
    font-size: 14px;
    font-weight: 400;
    color: rgba($color: #2B2F36, $alpha: 0.6);
  }
  ::v-deep .el-form-item__content {
    color: #2B2F36
  }

  .el-select, .el-input, .el-textarea{
    width: 500px;
  }
  ::v-deep .el-textarea__inner{
    height: 110px;
  }
  .textarea{
    word-break: break-all;
  }
}
</style>
