<template>
  <z-dialog
    ref="dialog"
    :title="$t('Organization.MoveOutMember')"
    :width="492"
    :loading="confirmLoadning"
    @cancel="cancel"
    @ok="ok"
  >
    <el-form
      ref="my-form"
      :model="formData"
      :rules="rules"
      size="small"
      class="my-form"
      :label-width="labelWidth"
    >
      <el-form-item :label="$t('Organization.Department')" prop="deptId">
        <my-department :department-id.sync="formData.deptId" :department-options="departmentOptions" />
      </el-form-item>
    </el-form>
  </z-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { formValidate } from '@/mixins/form-validate'
import MyDepartment from '@/components/Department'

export default {
  name: '',
  components: {
    MyDepartment
  },
  mixins: [formValidate],
  props: {
    deptId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      formData: {},
      userIds: [],
      departmentOptions: [],
      confirmLoadning: false
    }
  },
  computed: {
    ...mapGetters({
      language: 'language',
      departmentList: 'departmentList'
    }),
    rules() {
      return {
        deptId: [
          { required: true, message: this.$t('Common.MustForm'), trigger: 'blur' }
        ]
      }
    },
    labelWidth() {
      return this.language === 'zh-Hans' ? '60px' : '110px'
    }
  },

  methods: {
    show(id) {
      if (this.departmentList.length > 0) {
        this.departmentOptions = this.departmentList.filter(item => item.id !== this.deptId)
      }
      this.$refs['dialog'].show()
      this.$nextTick(() => {
        this.$refs['my-form'].clearValidate()
      })
    },
    cancel() {
      this.resetForm('my-form')
    },
    setUserIds(val) {
      this.userId = []
      this.userIds = []
      val.forEach(item => {
        this.userIds.push(item.id)
      })
    },
    ok() {
      this.submitForm('my-form').then(val => {
        if (val) {
          this.confirmLoadning = true
          this.formData.userIds = this.userIds

          tools.api.organization.MoveDeptUser(this.formData).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('PromptInfo.RemovedSuccessfully')
              })
              this.resetForm('my-form')
              this.$refs['dialog'].hide()
              this.$emit('moveoutMember', true)
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err.message
            })
            this.cancel()
            this.$emit('moveoutMember', true)
          }).finally(() => {
            this.confirmLoadning = false
            this.resetForm('my-form')
            this.$refs['dialog'].hide()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-form{
  ::v-deep .el-select{
    width: 100%;
  }
}
</style>
