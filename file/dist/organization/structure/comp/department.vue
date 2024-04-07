<template>
  <div class="sub-content">
    <div class="sub-title">{{ subTitle }}</div>
    <el-form ref="my-form" :model="formData" :rules="rules" :label-width="labelWidth" class="my-ruleForm">
      <el-form-item :label="$t('Organization.DepartmentName')" prop="deptSimpleName">
        <el-input v-model="formData.deptSimpleName" :maxlength="maxValueLength" />
      </el-form-item>
      <el-form-item v-if="level > 1" :label="$t('Organization.ParentDepartment')" prop="parentId">
        <my-department :department-id.sync="formData.parentId" :department-options="departmentOptions" />
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
      <el-form-item>
        <el-button v-permit="$permitKeys.organizationStructureCompDepartment.save" type="primary" @click="submitForm('my-form')">{{ $t('Common.Save') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { UpdateDept, GetDeptDetails, CheckDeptName } from '@/api/organization'
import MyDepartment from '@/components/Department'

export default {
  name: '',
  components: {
    MyDepartment
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      maxValueLength: tools.config.maxValueLength || 32,
      formData: {},
      oldFormData: {},
      departmentList: [],
      departmentOptions: []
    }
  },
  computed: {
    ...mapGetters({
      language: 'language',
      selectNodeTree: 'selectNodeTree',
      organizationTree: 'organizationTree'
    }),
    subTitle() {
      return this.level === 1 ? this.$t('Organization.OrgInfo') : this.$t('Organization.DepartmentInfo')
    },
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
          { required: true, message: this.$t('Common.MustForm'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    language() {
      this.$nextTick(() => {
        this.$refs['my-form'].clearValidate()
      })
    },
    selectNodeTree: {
      handler() {
        this.getDeptDetails()
      },
      deep: true
    }
  },
  created() {
    this.formData = { ...this.selectNodeTree }
  },
  methods: {
    getDeptDetails() {
      GetDeptDetails({ id: this.selectNodeTree.id }).then(res => {
        this.$refs['my-form'].clearValidate()
        if (!res?.data) {
          this.$message({
            type: 'error',
            message: this.$t('PromptInfo.DepartmentDeleted')
          })
          this.formData = {}
          this.$parent.getOrgTree()
          return
        }
        this.oldFormData = { ...res.data }
        this.formData = { ...res.data }
        this.departmentList = this.handleOrganizationTree(JSON.parse(JSON.stringify(this.organizationTree)))
        const departments = this.handelDepartment(this.departmentList) || []
        this.departmentOptions = this.handelDepartment_(departments)
      }).catch(err => {
        this.formData = {}
        this.$message({
          type: 'error',
          message: err.message
        })
        this.$parent.getOrgTree()
      })
    },
    handleOrganizationTree(treeData) {
      for (let i = 0; i < treeData.length; i++) {
        const item = treeData[i]
        if (item.id === this.formData.id) {
          treeData.splice(i, 1)
          break
        } else {
          if (item?.children?.length) {
            this.handleOrganizationTree(item.children)
          }
        }
      }
      return treeData
    },
    handelDepartment_(dataAll) {
      dataAll.forEach(currentItem => {
        this.handleAddOrgName(dataAll, currentItem, currentItem)
        currentItem.orgName = `${currentItem.orgName.length ? '(' + currentItem.orgName.join('/') + ')' : ''}`
      })
      return dataAll
    },
    handleAddOrgName(dataAll, currentItem, parentItem) {
      dataAll.find(item => {
        if (item.id === parentItem.parentId) {
          currentItem.orgName.unshift(item.deptSimpleName)
          if (item.parentId) {
            this.handleAddOrgName(dataAll, currentItem, item)
          }
        }
      })
    },

    handelDepartment(data, list = []) {
      data.forEach(item => {
        item.orgName = []
        list.push(item)
        if (item.children) this.handelDepartment(item.children, list)
      })
      return list
    },
    submitForm(formName) {
      if (!this.formData.deptSimpleName) {
        this.$message({
          type: 'info',
          message: this.$t('Common.MustForm')
        })
        this.formData = { ...this.oldFormData }
        return
      }
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const params = {
            deptSimpleName: this.formData.deptSimpleName,
            description: this.formData.description,
            id: this.formData.id,
            parentId: this.formData.parentId
          }
          let duplicateName = false
          if (this.formData.deptSimpleName !== this.oldFormData.deptSimpleName) {
            duplicateName = await this.checkDeptName()
          }
          if (duplicateName) return
          UpdateDept(params).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('PromptInfo.UpdateSuccessful')
            })
            this.$emit('updateTree', true, this.formData)
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: err.message || this.$t('PromptInfo.UpdateFailed')
            })
            this.$emit('updateTree', true)
          })
        } else {
          return false
        }
      })
    },

    checkDeptName() {
      return new Promise((resolve) => {
        let duplicateName = false
        CheckDeptName({
          deptSimpleName: this.formData.deptSimpleName,
          parentId: this.formData.parentId,
          id: this.formData.id
        }).then(res => {
          duplicateName = false
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: err.msg
          })
          this.formData = { ...this.oldFormData }
          duplicateName = true
        }).finally(() => {
          resolve(duplicateName)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-content{
  padding-left: 15px;
  ::v-deep .el-input{
    width: 100%;
  }
  ::v-deep .el-select{
    width: 100%;
  }
  ::v-deep .el-form-item{
    margin-bottom: unset;
    margin-top: 28px;
    max-width: 500px;
  }
  ::v-deep .el-textarea .el-input__count{
    background: unset;
  }
  .sub-title{
    padding-top: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #2B2F36;
    &::before{
      content: "";
      width: 3px;
      height: 16px;
      background: $--color-primary;
      margin-right: 8px;
      margin-bottom: 3px;
      display: inline-block;
      vertical-align: middle;
    }
  }

}
</style>
