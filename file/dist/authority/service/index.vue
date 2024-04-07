<template>
  <div>
    <template v-if="showServiceAuth">
      <div v-loading="loading" class="service">
        <div :class="['service-left', {'service-left-en': language == 'en'}]">
          <!-- 差分服务系统 -->
          <div class="service-card">
            <div class="card-left">
              <div class="service-card-header">
                {{ $t('authority.SystemDSS') }}
              </div>
              <div class="service-card-body">
                <div class="body-description">
                  {{ $t('authority.SystemDSSIntroduction') }}
                </div>
                <el-divider />
                <div class="body-content">
                  <div class="body-content-item">
                    <span>{{ $t('authority.IdentificationCode') }}：</span>
                    <span>{{ dssAuthInfo.identifyCode && dssAuthInfo.identifyCode.toUpperCase() }}</span>
                  </div>
                  <div class="body-content-item">
                    <span>{{ $t('authority.AuthorizationEndDate') }}：</span>
                    <span
                      :class="{'service--expiring': dssAuthInfo.dueDays >= 0 && dssAuthInfo.dueDays < 7, 'service--expired': dssAuthInfo.dueDays < 0 }"
                    >{{ dssAuthInfo.expireDate }}</span>
                  </div>
                  <div class="body-content-item">
                    <span>{{ $t('authority.AvailableResources') }}：</span>
                    <span>
                      {{
                        $t('authority.StreamsAndTerminalCounts', {streamCount: dssAuthInfo.permissionStationNum || 0, terminalCount: dssAuthInfo.permissionTerminalNum || 0})
                      }}
                    </span>
                  </div>
                  <div class="body-content-item">
                    <span>{{ $t('authority.UsedResources') }}：</span>
                    <span>{{ $t('authority.StreamsAndTerminalCounts', {streamCount: dssAuthInfo.receiverNum || 0, terminalCount: dssAuthInfo.terminalNum || 0}) }}</span>
                  </div>
                  <div class="body-content-item">
                    <span>{{ $t('authority.ProductFeatures') }}：</span>
                    <span v-for="(feature, index) in dssFeatures" :key="feature.path" :class="{'nopermission': feature.isPermission == 0}">{{ generateTitle(feature, index, dssFeatures.length) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-right">
              <div class="card-right-img">
                <el-image :src="dsspng" fit="cover" />
              </div>
              <template v-if="dssAuthInfo.identifyCode">
                <el-button v-permit="$permitKeys.authorityService.updateAuthorization" type="primary" @click="handleUpdateAuth('Dss', 1)">{{ $t('Operation.UpdateAuthorization') }}</el-button>
              </template>
              <template v-else>
                <el-button v-permit="$permitKeys.authorityService.activateNow" type="primary" @click="handleUpdateAuth('Dss', 0)">{{ $t('Operation.ActivateNow') }}</el-button>
              </template>
            </div>
          </div>

          <!-- 运维管理系统 -->
          <div class="service-card">
            <div class="card-left">
              <div class="service-card-header">
                {{ $t('authority.SystemPlatform') }}
              </div>
              <div class="service-card-body">
                <div class="body-description">
                  {{ $t('authority.SystemPlatformIntroduction') }}
                </div>
                <el-divider />
                <div class="body-content">
                  <div class="body-content-item">
                    <span>{{ $t('authority.IdentificationCode') }}：</span>
                    <span>{{ platformAuthInfo.identifyCode && platformAuthInfo.identifyCode.toUpperCase() }}</span>
                  </div>
                  <div class="body-content-item">
                    <span>{{ $t('authority.AuthorizationEndDate') }}：</span>
                    <span
                      :class="{'service--expiring': platformAuthInfo.dueDays >= 0 && platformAuthInfo.dueDays < 7, 'service--expired': platformAuthInfo.dueDays < 0 }"
                    >{{ platformAuthInfo.expireDate }}</span>
                  </div>
                  <div class="body-content-item">
                    <span>{{ $t('authority.ProductFeatures') }}：</span>
                    <span v-for="(feature, index) in platformFeatures" :key="feature.path" :class="{'nopermission': feature.isPermission == 0}">{{ generateTitle(feature, index, platformFeatures.length) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-right">
              <div class="card-right-img">
                <el-image :src="platformpng" fit="cover" />
              </div>
              <template v-if="platformAuthInfo.identifyCode">
                <el-button v-permit="$permitKeys.authorityService.updateAuthorization" type="primary" @click="handleUpdateAuth('Platform', 1)">{{ $t('Operation.UpdateAuthorization') }}</el-button>
              </template>
              <template v-else>
                <el-button v-permit="$permitKeys.authorityService.activateNow" type="primary" @click="handleUpdateAuth('Platform', 0)">{{ $t('Operation.ActivateNow') }}</el-button>
              </template>
            </div>
          </div>

          <!-- 运行监测系统 -->
          <div class="service-card">
            <div class="card-left">
              <div class="service-card-header">
                {{ $t('authority.SystemOMC') }}
              </div>
              <div class="service-card-body">
                <div class="body-description">
                  {{ $t('authority.SystemOMCIntroduction') }}
                </div>
                <el-divider />
                <div class="body-content">
                  <div class="body-content-item">
                    <span>{{ $t('authority.IdentificationCode') }}：</span>
                    <span>{{ omcAuthInfo.identifyCode && omcAuthInfo.identifyCode.toUpperCase() }}</span>
                  </div>
                  <div class="body-content-item">
                    <span>{{ $t('authority.AuthorizationEndDate') }}：</span>
                    <span
                      :class="{'service--expiring': omcAuthInfo.dueDays >= 0 && omcAuthInfo.dueDays < 7, 'service--expired': omcAuthInfo.dueDays < 0 }"
                    >{{ omcAuthInfo.expireDate }}</span>
                  </div>
                  <div class="body-content-item">
                    <span>{{ $t('authority.ProductFeatures') }}：</span>
                    <span v-for="(feature, index) in omcFeatures" :key="feature.path" :class="{'nopermission': feature.isPermission == 0}">{{ generateTitle(feature, index, omcFeatures.length) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-right">
              <div class="card-right-img">
                <el-image :src="omcpng" fit="cover" />
              </div>
              <template v-if="omcAuthInfo.identifyCode">
                <el-button v-permit="$permitKeys.authorityService.updateAuthorization" type="primary" @click="handleUpdateAuth('Omc', 1)">{{ $t('Operation.UpdateAuthorization') }}</el-button>
              </template>
              <template v-else>
                <el-button v-permit="$permitKeys.authorityService.activateNow" type="primary" @click="handleUpdateAuth('Omc', 0)">{{ $t('Operation.ActivateNow') }}</el-button>
              </template>
            </div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div :class="['service-right', {'service-right-en': language == 'en'}]">
          <div class="service-card">
            <div class="service-card-header">
              {{ $t('authority.BasicInformation') }}
            </div>
            <div class="service-card-body">
              <div class="body-content">
                <div class="body-content-item">
                  <span>{{ $t('authority.AuthorizedUser') }}：</span>
                  <span class="authorizeduser" title="123">{{ basicInfo.organizationName || '' }}</span>
                  <el-button v-if="basicInfo.organizationName" v-permit="$permitKeys.authorityService.modify" class="modify" type="text" @click="handleModify(0)">
                    {{ $t('Operation.Modify') }}
                  </el-button>
                </div>
                <div class="body-content-item">
                  <span>{{ $t('authority.BusinessLicense') }}：</span>
                  <span>{{ basicInfo.businessLicenseCode || '' }} </span>
                  <el-button v-if="basicInfo.businessLicenseCode" v-permit="$permitKeys.authorityService.modify" class="modify" type="text" @click="handleModify(1)">
                    {{ $t('Operation.Modify') }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 授权提醒 -->
          <div class="service-card">
            <div class="service-card-header">
              {{ $t('authority.AuthorizationReminder') }}
            </div>
            <div class="service-card-body author-card">
              <div class="body-content">
                <div v-for="(item) in authorizationData" v-cloak :key="item.content" class="body-content-item authorinfo">
                  <div class="item-top">
                    <div style="display: inline-block">
                      <span v-show="item.authorLevel == 0" class="authorType pt">
                        {{ $t('authority.Ordinary') }}
                      </span>
                      <span v-show="item.authorLevel == 1" class="authorType jg">
                        {{ $t('authority.Warning') }}
                      </span>
                      <span v-show="item.authorLevel == 2" class="authorType jj">
                        {{ $t('authority.Urgent') }}
                      </span>
                    </div>
                    <span>{{ item.time }}</span>
                  </div>
                  <div class="item-bottom" :title="item.content">
                    {{ item.content }}
                  </div>
                </div>
                <div v-if="authorizationData.length === 0" class="nodata">
                  {{ $t('Common.NoData') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <modify-basic-info :type="modifyType" :base-info="basicInfo" :dialog-visible="dialogVisible" @onConfirm="onConfirm" />
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ModifyBasicInfo from './components/ModifyBasicInfo'
import dsspng from '@/assets/dss@2x.png'
import platformpng from '@/assets/platform@2x.png'
import omcpng from '@/assets/omc@2x.png'
import { dssAuthFeatures, platformAuthFeatures, omcAuthFeatures } from 'hi-fas-utils/config'
import { generateTitle } from 'hi-fas-utils/src/i18n'
import { RegisterCurrentNum } from '@/api/system'

export default {
  name: 'ServiceAuthorization',
  components: {
    ModifyBasicInfo
  },
  data() {
    return {
      authorizationData: [],
      showServiceAuth: true,
      dialogVisible: false,
      basicInfo: {},
      modifyType: 0,
      omcpng,
      dsspng,
      platformpng,
      dssFeatures: dssAuthFeatures,
      platformFeatures: platformAuthFeatures,
      omcFeatures: omcAuthFeatures,
      dssAuthInfo: {},
      platformAuthInfo: {},
      omcAuthInfo: {},
      dueDays: 13,
      loading: false,
      registerInfo: {}
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language() {
      this.init()
    }
  },
  created() {
    this.isUpdateAuth = this.$route.name === 'UpdateAuthorization' || this.$route.name === 'ActivateService'
    this.showServiceAuth = !this.isUpdateAuth
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      const info = await this.$store.dispatch('system/getRegisterInfo')
      if (Array.isArray(info)) {
        this.basicInfo = {
          businessLicenseCode: undefined,
          organizationName: undefined
        }
        this.registerInfo = info
        this.authorizationData = []
        info.forEach(item => {
          if (!this.basicInfo.businessLicenseCode) {
            this.basicInfo.businessLicenseCode = item.businessLicenseCode || undefined
          }
          if (!this.basicInfo.organizationName) {
            this.basicInfo.organizationName = item.organizationName || undefined
          }
          const dueDays = this.handleDueDays(item)
          item.dueDays = dueDays
          const authorLevel = this.handleAuthorLevel(dueDays)
          const alarminfo = this.handleAlarmInfo(item, authorLevel)
          authorLevel > 0 && this.authorizationData.push(alarminfo)
        })
      } else {
        this.$message({
          type: 'error',
          message: info.msg || this.$t('PromptInfo.GetBasicInformationFailed')
        })
      }

      this.registerCurrentNum()
    },

    handleDueDays(item) {
      return item.expireDate && Math.ceil((new Date(item.expireDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) || 30
    },

    handleAuthorLevel(dueDays) {
      return dueDays < 0 ? 2 : ((dueDays >= 0 && dueDays < 7) ? 1 : 0)
    },

    handleAlarmInfo(item, authorLevel) {
      const alarminfo = {
        time: item.createTime,
        authorLevel
      }
      switch (item.serviceSystem) {
        case 'position':
          this.dssAuthInfo = item
          item?.systemRestrict?.length && this.handleDssFeatures(item.systemRestrict)
          if (authorLevel === 1) {
            alarminfo.content = this.$t('authority.DssExpiring') + '：' + item.expireDate
          } else if (authorLevel === 2) {
            alarminfo.content = this.$t('authority.DssExpired') + '：' + item.expireDate
          }
          break
        case 'station':
          this.platformAuthInfo = item
          item?.systemRestrict?.length && this.handlePlatformFeatures(item.systemRestrict)
          if (authorLevel === 1) {
            alarminfo.content = this.$t('authority.PlatformExpiring') + '：' + item.expireDate
          } else if (authorLevel === 2) {
            alarminfo.content = this.$t('authority.PlatformExpired') + '：' + item.expireDate
          }
          break
        case 'alarm':
          this.omcAuthInfo = item
          item?.systemRestrict?.length && this.handleOmcFeatures(item.systemRestrict)
          if (authorLevel === 1) {
            alarminfo.content = this.$t('authority.OmcExpiring') + '：' + item.expireDate
          } else if (authorLevel === 2) {
            alarminfo.content = this.$t('authority.OmcExpired') + '：' + item.expireDate
          }
          break
        default:
          break
      }
      return alarminfo
    },

    registerCurrentNum() {
      RegisterCurrentNum().then(res => {
        const data = res?.data || {}
        this.dssAuthInfo = { ...this.dssAuthInfo, ...data }
        const resStream = this.dssAuthInfo.permissionStationNum - this.dssAuthInfo.receiverNum
        const resTerminal = this.dssAuthInfo.permissionTerminalNum - this.dssAuthInfo.terminalNum
        const limitNum = 5
        const streamLevel = resStream < 0 ? 2 : ((resStream < limitNum && resStream >= 0) ? 1 : 0)
        const terminalLevel = resTerminal < 0 ? 2 : ((resTerminal < limitNum && resTerminal >= 0) ? 1 : 0)
        const streamInfo = {
          time: this.dssAuthInfo.createTime,
          authorLevel: streamLevel
        }
        const terminalInfo = {
          time: this.dssAuthInfo.createTime,
          authorLevel: terminalLevel
        }
        if (streamLevel === 1) {
          streamInfo.content = this.$t('authority.StreamRemain', { streamRemain: resStream })
        } else if (streamLevel === 2) {
          streamInfo.content = this.$t('authority.StreamLimit')
        }

        if (terminalLevel === 1) {
          terminalInfo.content = this.$t('authority.TerminalRemain', { terminalRemain: resTerminal })
        } else if (terminalLevel === 2) {
          terminalInfo.content = this.$t('authority.TerminalLimit')
        }
        streamLevel > 0 && this.authorizationData.push(streamInfo)
        terminalLevel > 0 && this.authorizationData.push(terminalInfo)
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err.msg || this.$t('PromptInfo.ObtainAuthorizationUsageFailed')
        })
      }).finally(() => {
        this.loading = false
      })
    },

    handleUpdateAuth(type, isUpdate = 0) {
      let serviceSystem = 'position'
      let info = this.basicInfo
      info.status = isUpdate
      if (type === 'Dss') {
        serviceSystem = 'position'
        info = { ...this.dssAuthInfo, ...info }
      } else if (type === 'Platform') {
        serviceSystem = 'station'
        info = { ...this.platformAuthInfo, ...info }
      } else {
        serviceSystem = 'alarm'
        info = { ...this.omcAuthInfo, ...info }
      }
      if (isUpdate) {
        const params = {
          title: 'UpdateRegistrationcode' + type,
          isUpdate,
          serviceSystem,
          info
        }
        this.$router.push({ name: 'UpdateAuthorization', params: { ...params }})
      } else {
        const params = {
          title: 'ActivateService' + type,
          isUpdate,
          serviceSystem,
          info
        }
        this.$router.push({ name: 'ActivateService', params: { ...params }})
      }
    },

    getAlarmInfo(info) {
      info.forEach(item => {
        const dueDays = item.expireDate && Math.ceil((new Date(item.expireDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) || 30
        item.dueDays = dueDays
        const authorLevel = dueDays < 0 ? 2 : ((dueDays >= 0 && dueDays < 7) ? 1 : 0)
        const alarminfo = this.handleAlarmInfo(item, authorLevel)
        authorLevel > 0 && this.authorizationData.push(alarminfo)
      })
    },
    handleModify(type = 0) {
      this.modifyType = type
      this.dialogVisible = true
    },
    onConfirm(success) {
      this.dialogVisible = false
      if (success) {
        this.init()
      }
    },

    // 处理差分系统的产品功能
    handleDssFeatures(systemRestrict = []) {
      const featuresMap = new Map()
      this.dssFeatures = []
      dssAuthFeatures.forEach(feature => {
        featuresMap.set(feature.name, feature)
      })
      systemRestrict.forEach(item => {
        if (featuresMap.has(item.key)) {
          const feature = featuresMap.get(item.key)
          feature.isPermission = item.value
        }
      })
      this.dssFeatures = [...featuresMap.values()]
    },

    // 处理运维系统的产品功能
    handlePlatformFeatures(systemRestrict = []) {
      const featuresMap = new Map()
      this.platformFeatures = []
      platformAuthFeatures.forEach(feature => {
        featuresMap.set(feature.name, feature)
      })
      systemRestrict.forEach(item => {
        if (featuresMap.has(item.key)) {
          const feature = featuresMap.get(item.key)
          feature.isPermission = item.value
        }
      })
      this.platformFeatures = [...featuresMap.values()]
    },

    // 处理运监系统的产品功能
    handleOmcFeatures(systemRestrict = []) {
      const featuresMap = new Map()
      this.omcFeatures = []
      omcAuthFeatures.forEach(feature => {
        featuresMap.set(feature.name, feature)
      })
      systemRestrict.forEach(item => {
        if (featuresMap.has(item.key)) {
          const feature = featuresMap.get(item.key)
          feature.isPermission = item.value
        }
      })
      this.omcFeatures = [...featuresMap.values()]
    },

    generateTitle(feature, index, length) {
      const copy = { ...feature }
      const name = generateTitle(copy)
      const res = (index === length - 1) ? name : (name + '，')
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.service {
  min-width: 1080px;
  margin: 20px;
  &-left{
    margin-right: 16px;
    width: calc(100% - 336px);
    position: relative;
    display: inline-block;
    &-en{
      width: calc(100% - 406px);
    }
  }
  &-right{
    width: 320px;
    float: right;
    &-en{
      width: 390px;
    }
  }

  &-card {
    box-shadow: 0px 2px 4px 0px rgba(54, 58, 80, 0.3);
    padding: 20px;
    background: #fff;
    margin-top: 0px;
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0px;
    }
    &-header{
      font-size: 16px;
      font-weight: 500;
      color: #2b2f36;
      margin-bottom: 26px;
      border-left: 3px solid #4980ff;
      padding-left: 8px;
    }
    &-body {
      width: 100%;
      padding: 0 0 0 10px;
    }
    .card{
      &-left {
        vertical-align: middle;
        display: inline-block;
        width: calc(100% - 170px);
        margin-right: 20px;
      }
      &-right{
        vertical-align: middle;
        display: inline-block;
        width: 150px;
        &-img{
          height: 150px;
          width: 150px;
          margin-bottom: 12px;
          .el-image{
            width: 100%;
            height: 100%;
          }
        }
        .el-button{
          width: 100%;
        }
      }
    }
    .body{
      &-description{
        font-size: 14px;
      }
      &-content{
        &-item{
          margin-bottom: 18px;
          position: relative;
          &:last-child{
            margin-bottom: 0px;
          }
          .modify{
            font-size: 14px;
            position: absolute;
            right: 0px;
            top: 0px;
            padding: 0;
          }
        }
      }
    }
  }
}

.item-top{
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;

  .authorType {
    display: inline-block;
    vertical-align: middle;
    padding: 1px 5px;
    border-radius: 4px;
  }

  .pt {
    background: rgba(71, 119, 230, 20%);
    color: #4777e6;
  }

  .jg {
    background: rgba(255, 196, 13, 20%);
    color: #ffc40d;
  }

  .jj {
    background: rgba(246, 64, 3, 20%);
    color: #f64049;
  }
}
.item-bottom{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.authorinfo{
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 18px;
  &:last-child{
    border-bottom: none;
    padding-bottom: 0px;
  }
}

.author-card{
  max-height: 563px;
  overflow: auto;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    box-shadow: inset 0 0 5px transparent;
    background: #cccaca;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px transparent;
    border-radius: 10px;
    background: transparent;
  }
}

.el-divider--horizontal{
  margin: 20px 0;
}

.service--expiring{
  color: #E7B229;
}
.service--expired{
  color: #FF4D4F
}

.authorizeduser{
  width: 130px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.nopermission{
  color: #a3a3a3;
}

.nodata{
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  color: #909399;
  font-style: oblique;
  font-family: PingFangSC-Regular, PingFang SC, Microsoft YaHei, Arial, sans-serif;
}
</style>
