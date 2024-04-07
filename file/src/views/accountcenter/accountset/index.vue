<template>
  <div class="container--bg container-nopadding--bg">
    <div class="carditem basicinfo">
      <div class="carditem-title">
        {{ $t('SecuritySet.SecuritySet') }}
      </div>
      <div class="carditem-body">
        <el-form
          class="form"
          label-position="right"
          :label-width="labelWidth"
          :loading="loading"
        >
          <el-form-item :label="`${$t('SecuritySet.LimitFailedLogins')}：`">
            <el-input-number v-model="limitFailedLogins" class="numbers" :controls="false" :min="3" :max="7" @change="handleFailedLoginsChange" />
            <span class="tips">{{ $t('SecuritySet.LimitFailedLoginsTips') }}</span>
          </el-form-item>
          <el-form-item :label="`${$t('SecuritySet.DisableLogonInterval')}：`">
            <el-input-number v-model="disableLogonInterval" class="numbers" :controls="false" :min="10" :max="30" @change="handleLogonIntervalChange" />
            <span class="tips">{{ $t('SecuritySet.DisableLogonIntervalTips') }}</span>
          </el-form-item>
          <el-form-item :label="`${$t('SecuritySet.PasswordExpirationTime')}：`">
            <el-input-number v-model="passwordExpirationTime" class="numbers" :controls="false" :min="30" :max="90" @change="handleExpirationTimeChange" />
            <span class="tips">{{ $t('SecuritySet.PasswordExpirationTimeTips') }}</span>
          </el-form-item>
          <el-form-item :label="`${$t('SecuritySet.MaximumIdleTimeOfConnection')}：`">
            <el-input-number v-model="maximumIdleTimeOfConnection" class="numbers" :controls="false" :min="15" :max="30" @change="handleMaximumIdleTimeChange" />
            <span class="tips">{{ $t('SecuritySet.MaximumIdleTimeOfConnectionTips') }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="carditem">
      <div class="carditem-title">
        {{ $t('SecuritySet.PasswordVerificationRules') }}
      </div>
      <div class="carditem-body">
        <el-form
          class="form"
          label-position="right"
          :label-width="labelWidth"
        >
          <el-form-item :label="`${$t('SecuritySet.MinimumPasswordLength')}：`">
            <el-input-number v-model="minimumPasswordLength" class="numbers" disabled :controls="false" />
          </el-form-item>
          <el-form-item :label="`${$t('SecuritySet.MustContainEnglish')}：`">
            <el-switch v-model="mustContain" disabled />
          </el-form-item>
          <el-form-item :label="`${$t('SecuritySet.MustContainNumeric')}：`">
            <el-switch v-model="mustContain" disabled />
          </el-form-item>
          <el-form-item :label="`${$t('SecuritySet.MustContainSpecial')}：`">
            <el-switch v-model="mustContain" disabled />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetSafetyInfo, UpdateSafetyInfo } from 'hi-fas-utils/src/api/system.js'
import { setAliveTimeOut } from 'hi-fas-utils/src/security'
export default {
  data() {
    return {
      limitFailedLogins: 5, // 限制失败登录次数
      disableLogonInterval: 10, // 禁止登录时间间隔
      passwordExpirationTime: 90, // 密码过期时间
      maximumIdleTimeOfConnection: 90, // 连接最大空闲时间

      minimumPasswordLength: 8,
      mustContain: true,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['language']),
    labelWidth() {
      return this.language === 'en' ? '350px' : '200px'
    }
  },
  created() {
    this.fetchSafeInfo()
  },
  methods: {
    // 限制失败登录次数
    handleFailedLoginsChange(currentValue, oldValue) {
      // 删除数字，恢复原数字
      if (currentValue === '' || currentValue === null || currentValue === undefined) {
        this.$nextTick(() => {
          this.limitFailedLogins = oldValue
        })
        return
      }
      this.UpdateSafeInfo()
    },
    // 禁止登录时间间隔
    handleLogonIntervalChange(currentValue, oldValue) {
      // 删除数字，恢复原数字
      if (currentValue === '' || currentValue === null || currentValue === undefined) {
        this.$nextTick(() => {
          this.disableLogonInterval = oldValue
        })
        return
      }
      this.UpdateSafeInfo()
    },
    // 密码过期时间
    handleExpirationTimeChange(currentValue, oldValue) {
      // 删除数字，恢复原数字
      if (currentValue === '' || currentValue === null || currentValue === undefined) {
        this.$nextTick(() => {
          this.passwordExpirationTime = oldValue
        })
        return
      }
      this.UpdateSafeInfo()
    },
    // 连接最大空闲时间
    handleMaximumIdleTimeChange(currentValue, oldValue) {
      // 删除数字，恢复原数字
      if (currentValue === '' || currentValue === null || currentValue === undefined) {
        this.$nextTick(() => {
          this.maximumIdleTimeOfConnection = oldValue
        })
        return
      }
      this.UpdateSafeInfo(true)
    },
    // 查询
    fetchSafeInfo() {
      this.loading = true
      GetSafetyInfo().then(res => {
        const { id, failCount, lockedTime, expiredPeriod, maxKeepTime } = res.data
        this.safeId = id
        this.limitFailedLogins = failCount
        this.disableLogonInterval = lockedTime
        this.passwordExpirationTime = expiredPeriod
        this.maximumIdleTimeOfConnection = maxKeepTime
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      }).finally(() => {
        this.loading = false
      })
    },
    // 修改
    UpdateSafeInfo(setKeep) {
      const params = {
        id: this.safeId,
        failCount: this.limitFailedLogins,
        lockedTime: this.disableLogonInterval,
        expiredPeriod: this.passwordExpirationTime,
        maxKeepTime: this.maximumIdleTimeOfConnection
      }
      this.loading = true
      UpdateSafetyInfo(params).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('Common.OperationSucceeded')
        })
        if (setKeep) setAliveTimeOut(params.maxKeepTime)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      }).finally(() => {
        this.fetchSafeInfo()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.carditem{
  padding: 24px 24px 17px 24px;
}
.basicinfo{
  padding: 24px 24px 8px 24px;
  border-bottom: 1px solid #EFEFEF;
}

::v-deep .el-form-item__label, ::v-deep .el-form-item__content{
  font-size: 14px;
  color: #2B2F36;
}

.numbers{
  width: 300px;
  ::v-deep input{
    text-align: left;
  }
}
.tips{
  display: block;
  height: 32px;
  color: #909399;
  font-size: 12px;
}
</style>
