<template>
  <z-dialog ref="dialog" :title="$t('Organization.AddDepartment')" :width="language === 'zh-Hans' ? 492 : 600" @cancel="cancel" @ok="ok">
    <el-form ref="my-form" :model="formData" :rules="rules" :label-width="labelWidth" class="my-ruleForm">
      <el-form-item :label="$t('Organization.DepartmentName')" prop="deptSimpleName">
        <el-input v-model="formData.deptSimpleName" :maxlength="maxValueLength" />
      </el-form-item>
      <el-form-item :label="$t('Organization.ParentDepartment')" prop="parentId">
        <my-department :department-id.sync="formData.parentId" :department-options="departmentList" />
      </el-form-item>
      <el-form-item :label="$t('Organization.Duty')">
        <el-input
          v-model="formData.description"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4 }"
          maxlength="255"
          resize="none"
        />
      </el-form-item>
    </el-form>
  </z-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { formValidate } from '@/mixins/form-validate'
import { CreateDept, CheckDeptName } from '@/api/organization'
import MyDepartment from '@/components/Department'

export default {
  name: 'AddDepartment',
  components: {
    MyDepartment
  },
  mixins: [formValidate],
  data() {
    return {
      maxValueLength: tools.config.maxValueLength || 32,
      formData: {}
    }
  },
  computed: {
    ...mapGetters({
      language: 'language',
      departmentList: 'departmentList'
    }),
    labelWidth() {
      return this.language === 'zh-Hans' ? '85px' : '220px'
    },
    rules() {
      return {
        deptSimpleName: [
          { required: true, message: this.$t('Common.MustForm'), trigger: 'blur' },
          { validator: tools.validate.validateSpecial, trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: this.$t('Common.MustForm'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    show(id) {
      this.$refs['dialog'].show()
      this.$nextTick(() => {
        this.$refs['my-form'].clearValidate()
      })
    },
    cancel() {
      this.formData = {}
      this.resetForm('my-form')
    },
    ok() {
      this.submitForm('my-form').then(async val => {
        if (val) {
          CheckDeptName({
            deptSimpleName: this.formData.deptSimpleName,
            parentId: this.formData.parentId,
            id: 0
          }).then(async() => {
            CreateDept(this.formData).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: this.$t('Common.AddSuccess')
                })
                this.$emit('adddept', true, this.formData)
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
                this.$emit('adddept', false)
              }
            }).catch((err) => {
              this.$message({
                type: 'error',
                message: err.message || this.$t('Common.AddFailed')
              })
              this.$emit('adddept', false)
              this.$parent.getOrgTree()
            })
          }).catch((err) => {
            this.$message({
              type: 'info',
              message: err.msg
            })
          }).finally(() => {
            this.resetForm('my-form')
            this.formData = {}
            this.$refs['dialog'].hide()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-ruleForm{
  ::v-deep .el-input{
    width: 100%;
  }
  ::v-deep .el-select{
    width: 100%;
  }
}
</style>
