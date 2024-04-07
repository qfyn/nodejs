<template>
  <el-form
    ref="form"
    class="appmanage-right-form"
    :model="formData"
    :rules="rules"
    label-position="left"
    :label-width="language === 'zh-Hans' ? '100px' : '150px'"
  >
    <el-form-item v-if="currentNodeLevel === 2" :label="`${$t('authority.System')}：`" prop="parentName">
      <span>{{ parentMenuName }}</span>
    </el-form-item>
    <el-form-item v-if="currentNodeLevel === 3" :label="`${$t('authority.SuperiorMenu')}：`" prop="parentName">
      <span>{{ parentMenuName }}</span>
    </el-form-item>

    <el-form-item :label="`${currentNodeLevel === 1 ? $t('authority.Name') : $t('authority.MenuName')}：`" prop="name">
      <el-input v-if="false" v-model.trim="formData.name" disabled maxlength="32" :placeholder="$t('PromptInfo.PleaseInput')" />
      <span>{{ menuName }}</span>
    </el-form-item>
    <el-form-item :label="`${currentNodeLevel === 1 ? $t('authority.Contents') : $t('authority.Route')}：`" prop="path">
      <el-input v-if="false" v-model.trim="formData.path" maxlength="255" :placeholder="$t('PromptInfo.PleaseInput')" />
      <span>{{ formData.path }}</span>
    </el-form-item>

    <el-form-item v-if="currentNodeLevel !== 1" :label="`${$t('authority.HideMenu')}：`" prop="hidden">
      <el-radio-group v-model="formData.hidden">
        <el-radio :label="0">{{ $t('authority.Show') }}</el-radio>
        <el-radio :label="1">{{ $t('authority.Hide') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <div v-if="currentNodeLevel === 2">
      <el-form-item :label="`${$t('authority.Icon')}：`" prop="icon">
        <div class="form-icon" @click="handleIcon">
          <div class="form-icon__mark" />
          <div class="form-icon__icon">
            <svg-icon style="color: rgb(204, 204, 204)" :icon-class="menuIcon[formData.icon]" />
          </div>

        </div>
        <ul :id="iconListId" class="form-icon-list">
          <li v-for="(item, index) in menuIcon " :key="index" class="form-icon-item" @click="handleSelectIcon(index)">
            <svg-icon style="color: rgb(204, 204, 204)" :icon-class="item" />
          </li>
        </ul>
      </el-form-item>
    </div>

    <div>
      <el-form-item :label="`${$t('authority.Describe')}：`">
        <el-input
          v-model="formData.description"
          :placeholder="$t('PromptInfo.PleaseInput')"
          type="textarea"
          maxlength="255"
          :autosize="{ minRows: 5, maxRows: 5}"
        />
      </el-form-item>
    </div>
    <el-form-item>
      <el-button :loading="conformLoading" type="primary" @click="onConfirm">{{ $t('Common.Save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { AddResource, UpdateResource, CheckRepeatName, CheckRepeatPath } from '@/api/authority'
import { mapGetters } from 'vuex'
import menuIcon from 'hi-fas-components/icons/index'

import { validateMenuName, validatePath } from '@/utils/validate'
import { generateTitle } from 'hi-fas-utils/src/i18n'

export default {
  props: {
    currentNodeLevel: {
      type: Number,
      default: 1
    },
    active: {
      type: String,
      default: 'modify'
    }
  },
  data() {
    return {
      formData: {
        hidden: 0,
        icon: 1
      },
      menuIcon,
      modifyName: null,
      modifyPath: null,
      iconListId: 'iconList_modify',
      conformLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'language']),
    rules() {
      const checkRepeatName = (rule, value, callback) => {
        if (value && this.modifyName !== value) {
          const params = {
            isUpdate: false,
            layer: this.formData.layer,
            name: value
          }
          if (this.formData.layer !== 1) {
            params.systemId = this.formData.systemId
          }
          if (this.modifyName) {
            params.id = this.formData.id
            params.isUpdate = true
          }

          CheckRepeatName(params).then(res => {
            if (res?.data) {
              callback(new Error(this.$t('PromptInfo.AlreadyExists')))
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }

      const checkRepeatPath = (rule, value, callback) => {
        if (value && this.modifyPath !== value) {
          const params = {
            isUpdate: false,
            layer: this.formData.layer,
            path: value
          }
          if (this.formData.layer !== 1) {
            params.systemId = this.formData.systemId
          }
          if (this.modifyPath) {
            params.id = this.formData.id
            params.isUpdate = true
          }

          CheckRepeatPath(params).then(res => {
            if (res?.data) {
              callback(new Error(this.$t('PromptInfo.AlreadyExists')))
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }

      return {
        parentName: [
          { required: true, message: this.$t('PromptInfo.PleaseSelect'), trigger: 'change' }
        ],
        name: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' },
          { validator: validateMenuName, trigger: 'blur' },
          { validator: checkRepeatName, trigger: 'blur' }
        ],
        path: [
          { required: true, message: this.$t('PromptInfo.PleaseInput'), trigger: 'blur' },
          { validator: validatePath, trigger: 'blur' },
          { validator: checkRepeatPath, trigger: 'blur' }
        ],
        hidden: [
          { required: true, message: this.$t('PromptInfo.PleaseSelect'), trigger: 'change' }
        ],
        icon: [
          { required: true, message: this.$t('PromptInfo.PleaseSelect'), trigger: 'change' }
        ]
      }
    },
    parentMenuName() {
      return generateTitle(this.formData.parentData)
    },
    menuName() {
      return generateTitle(this.formData)
    }
  },
  watch: {
    active(value) {
      document.getElementById(this.iconListId) && (document.getElementById(this.iconListId).style.display = 'none')
      if (value === 'add') {
        this.iconListId = 'iconList_add'
      } else {
        this.iconListId = 'iconList_modify'
      }
    }
  },
  methods: {
    getFormData(data) {
      this.resetField()
      this.formData = { ...data }
      this.$set(this.formData, 'icon', this.formData?.icon || 1)
      if (this.active === 'add') {
        this.modifyName = null
        this.modifyPath = null
        this.$set(this.formData, 'hidden', 0)
      } else {
        this.modifyName = this.formData.name
        this.modifyPath = this.formData.path
      }
    },
    onConfirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return

        if (this.formData.layer === 2) {
          this.formData.icon = +this.formData.icon
        } else {
          this.formData.icon = ''
        }
        let handleSubmit = AddResource
        if (this.active === 'add') {
          this.formData.createBy = this.userInfo.id
        } else {
          handleSubmit = UpdateResource
          this.formData.updateBy = this.userInfo.id
        }
        this.conformLoading = true

        handleSubmit(this.formData).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('PromptInfo.SaveSuccess')
          })
          this.$emit('onConfirm', true)
        }).catch((err) => {
          this.$message({
            type: 'error',
            message: err.msg
          })
          this.$emit('onConfirm', false)
        }).finally(() => {
          this.conformLoading = false
          this.active === 'add' && this.resetField()
        })
      })
    },
    handleIcon(event) {
      event.stopPropagation()
      document.getElementById(this.iconListId).style.display = 'block'
      document.onclick = () => {
        document.getElementById(this.iconListId).style.display = 'none'
        document.onclick = null
      }
    },
    handleSelectIcon(index) {
      this.$set(this.formData, 'icon', index)
    },
    resetField() {
      this.$refs.form && this.$refs.form.resetFields()
      this.formData = {
        hidden: 0,
        icon: 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-icon{
  position: relative;
  height: 30px;
  width: 29px;
  border: 1px solid #E3E2E5;
  border-radius: 4px;
  overflow: hidden;
  &__icon {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  &__mark{
    position: absolute;
    border-style: solid;
    border-width: 0px 0px 9px 9px;
    border-color: transparent transparent $--color-primary transparent;
    width: 0px;
    height: 0px;
    bottom: 0;
    right: 0;
    cursor: pointer;
  }
  &-list{
    position: absolute;
    display: none;
    z-index: 1;
    background: #FFFFFF;
    width: 294px;
    max-height: 200px;
    border: 1px solid #E3E2E5;
    margin: 0;
    left: -1px;
    top: 28px;
    border-radius: 4px;
    list-style: none;
    box-sizing: border-box;
    float: left;
    padding: 13px 20px;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar-track-piece {
      background: #EFEFEF;
      border-radius: 5px;
    }

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background:rgba(0,0,0,0.25);
      border-radius: 20px;
    }

    &::-webkit-scrollbar-thumb:hover {
      cursor: pointer;
    }
  }
  &-item{
    box-sizing: border-box;
    display: inline-block;
    margin-right: 10px;
    height: 22px;
    width: 22px;
    line-height: 22px;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    vertical-align: middle;
    &:nth-child(8n){
      margin-right: 0px;
    }
    &:hover{
      border: 1px solid $--color-primary;
    }
  }
}
.svg-icon{
  width: 22px;
  height: 22px;
}
</style>
