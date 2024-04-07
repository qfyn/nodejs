<template>
  <z-dialog
    ref="dialog"
    :title="editType === 1 ? $t('Organization.AddMember') : $t('Organization.EditeMember')"
    :width="language === 'zh-Hans' ? 500 : 600"
    :loading="confirmLoadning"
    @cancel="cancel"
    @ok="ok"
  >
    <el-form
      ref="my-form"
      :label-width="labelWidth"
      :model="formData"
      :rules="rules"
      size="small"
      class="my-form"
    >
      <el-form-item :label="$t('Organization.Account') + '：'" prop="name">
        <el-input v-model.trim="formData.name" :disabled="editType === 2" :maxlength="20" :placeholder="$t('PromptInfo.PleaseInputAccountNumber')" />
      </el-form-item>
      <el-form-item v-if="editType === 1" :label="$t('Common.Password') + '：'" prop="password" :style="marginBottom">
        <el-input v-model.trim="formData.password" type="password" autocomplete="new-password" show-password :maxlength="50" :placeholder="$t('PromptInfo.PleaseInputPassword')" />
      </el-form-item>
      <el-form-item :label="$t('Organization.ContactMobile') + '：'" prop="telephone">
        <el-input v-model.trim="formData.telephone" :maxlength="20" :placeholder="$t('PromptInfo.PleaseEnterContactCellPhone')" />
      </el-form-item>
      <el-form-item :label="$t('Organization.ContactEmail') + '：'" prop="email">
        <el-input v-model.trim="formData.email" :maxlength="320" :placeholder="$t('PromptInfo.PleaseEnterYourContactEmail')" />
      </el-form-item>
      <el-form-item :label="$t('Organization.ValidPeriod') + '：'" prop="loseEfficacyTime">
        <el-date-picker
          v-model="formData.loseEfficacyTime "
          type="date"
          :placeholder="$t('PromptInfo.PleaseSelectDate')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item :label="$t('Organization.BelongingDepartment') + '：'" prop="orgId">
        <my-department :department-id.sync="formData.orgId" :department-options="departmentList" />
      </el-form-item>
      <el-form-item v-if="!(editType !==1 && formData.roleType === 0)" :label="$t('Organization.Role') + '：'" prop="roleIds">
        <el-select v-model="formData.roleIds" multiple :placeholder="$t('Organization.PleaseSelectRole')">
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </z-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { formValidate } from '@/mixins/form-validate'
import { CreateUser, CheckAccountName, CheckAccountEmail, EditAccount, GetRoles } from '@/api/organization'
import MyDepartment from '@/components/Department'
import { rsaEncrypt } from 'hi-fas-utils/src/jsencrypt'

export default {
  name: 'AddMember',
  components: {
    MyDepartment
  },
  mixins: [formValidate],
  data() {
    return {
      maxValueLength: tools.config.maxValueLength,
      formData: {},
      resourceList: [],
      editType: 1,
      roleOptions: [],
      confirmLoadning: false
    }
  },
  computed: {
    ...mapGetters({
      language: 'language',
      departmentList: 'departmentList'
    }),
    labelWidth() {
      return this.language === 'zh-Hans' ? '100px' : '190px'
    },
    pickerOptions() {
      return this.handlepickerOptions()
    },
    rules() {
      const uniqueName = (rule, value, callback) => {
        if (value && this.editName !== value) {
          CheckAccountName({ name: value }).then(res => {
            if (+res.code !== 200) {
              callback(new Error(this.$t('PromptInfo.TheAccountNameIsAlreadyOccupied')))
            } else {
              callback()
            }
          }).catch(() => {
            callback(new Error(this.$t('PromptInfo.TheAccountNameIsAlreadyOccupied')))
          })
        } else {
          callback()
        }
      }
      const uniqueEmail = (rule, value, callback) => {
        if (value && this.editEmail !== value) {
          CheckAccountEmail({ email: value }).then(res => {
            if (+res.code !== 200) {
              callback(new Error(this.$t('PromptInfo.EMailIsOccupied')))
            } else {
              callback()
            }
          }).catch(() => {
            callback(new Error(this.$t('PromptInfo.EMailIsOccupied')))
          })
        } else {
          callback()
        }
      }
      return {
        name: [
          { required: true, message: this.$t('PromptInfo.PleaseInputAccountNumber'), trigger: 'blur' },
          { validator: uniqueName, trigger: 'blur' },
          { validator: tools.validate.validateUserName, trigger: 'blur' },
          { min: 6, max: 20, message: this.$t('PromptInfo.SixToTwentyLength'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('PromptInfo.PleaseInputPassword'), trigger: 'blur' },
          { validator: tools.validate.validatePsw, trigger: 'blur' },
          { min: 8, max: 50, message: this.$t('PromptInfo.EightToFiftyLength'), trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: this.$t('PromptInfo.PleaseEnterContactCellPhone'), trigger: 'blur' },
          { required: true, validator: tools.validate.validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('PromptInfo.PleaseEnterYourContactEmail'), trigger: 'blur' },
          { validator: uniqueEmail, trigger: 'blur' },
          { required: true, validator: tools.validate.validateEmail, trigger: 'blur' }
        ],
        loseEfficacyTime: [
          { required: true, message: this.$t('PromptInfo.PleaseSelectValidPeriod'), trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: this.$t('Organization.PleaseSelectDepartment'), trigger: 'change' }
        ],
        roleIds: [
          { required: true, message: this.$t('Organization.PleaseSelectRole'), trigger: 'change' }
        ]
      }
    },
    marginBottom() {
      return this.language === 'en' ? 'margin-bottom: 30px;' : 'margin-bottom: 18px;'
    }
  },
  watch: {
  },
  created() {
    if (this.departmentList.length === 0) {
      this.$store.dispatch('organization/getOrgTree')
    }
  },

  methods: {
    // 类型：1-新增；2-编辑
    show(param, editType = 1) {
      this.formData = {}
      this.editType = editType
      this.getRoles()
      this.$refs['dialog'].show()
      this.$nextTick(() => {
        this.$refs['my-form'].clearValidate()
      })
      if (editType === 2 && param) {
        this.formData = JSON.parse(JSON.stringify(param))
        this.editName = this.formData.name
        this.editEmail = this.formData.email
      }
    },
    cancel() {
      this.resetForm('my-form')
      this.formData = {}
    },
    ok() {
      if (this.editType === 1) {
        this.add()
      } else {
        this.edite()
      }
    },
    // 新增
    add() {
      this.submitForm('my-form').then(async val => {
        if (val) {
          this.confirmLoadning = true
          const params = JSON.parse(JSON.stringify(this.formData))
          params.password = rsaEncrypt(params.password)
          params.status = 1
          params.loseEfficacyTime = params.loseEfficacyTime + ' 23:59:59'
          CreateUser(params).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('Common.AddSuccess')
              })
              this.$emit('addMember', true)
            } else {
              this.$message({
                type: 'error',
                message: res.msg || this.$t('Common.AddFailed')
              })
              this.$emit('addMember', false)
            }
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err.msg || this.$t('Common.AddFailed')
            })
          }).finally(() => {
            this.confirmLoadning = false
            this.resetForm('my-form')
            this.$refs['dialog'].hide()
          })
        }
      })
    },
    // 编辑
    edite() {
      this.submitForm('my-form').then(val => {
        if (val) {
          this.confirmLoadning = true
          const params = JSON.parse(JSON.stringify(this.formData))
          params.password = rsaEncrypt(params.password)
          params.loginType = 1
          params.loseEfficacyTime = params.loseEfficacyTime + ' 23:59:59'

          if (new Date(params.loseEfficacyTime).getTime() >= new Date().getTime()) {
            params.status = 1
          } else {
            params.status = 0
          }

          EditAccount(params).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('Common.EditSuccess')
              })
              this.$emit('editMember', true)
            } else {
              this.$message({
                type: 'error',
                message: res.msg || this.$t('Common.EditFailed')
              })
              this.$emit('editMember', false)
            }
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err.msg || this.$t('Common.EditFailed')
            })
          }).finally(() => {
            this.confirmLoadning = false
            this.resetForm('my-form')
            this.$refs['dialog'].hide()
          })
        }
      })
    },
    getRoles() {
      GetRoles().then(res => {
        this.roleOptions = res.data
      })
    },
    handlepickerOptions() {
      return {
        disabledDate(time) {
          const timeExist = (new Date().getTime() - 3600 * 1000 * 24) < time.getTime()
          return !timeExist
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.my-form {
  ::v-deep .el-input{
    width: 100%;
  }
  ::v-deep .el-select{
    width: 100%;
  }
}
</style>
