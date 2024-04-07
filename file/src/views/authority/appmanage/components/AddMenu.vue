<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    :width="language === 'en' ? '550px' : '450px'"
    :modal="true"
    @close="handleCancel"
  >
    <div slot="title" class="dialog-title">
      <span>{{ actionName }}</span>
    </div>
    <menu-form ref="menuForm" class="menuform" :active="'add'" :current-node-level="addNodeLevel" @onConfirm="onConfirm" />
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuForm from './MenuForm'

export default {
  name: '',
  components: {
    MenuForm
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    addNodeLevel: {
      type: Number,
      default: 1
    },
    nodeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    ...mapGetters({
      language: 'language'
    }),
    actionName() {
      return this.addNodeLevel === 1
        ? this.$t('authority.AddSubsystem') : this.$t('authority.AddMenu')
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.formData = { ...this.nodeInfo }
        this.$nextTick(() => {
          this.$refs.menuForm.getFormData(this.formData)
        })
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('onConfirm', false)
      this.$refs.menuForm.resetField()
    },
    onConfirm(bool) {
      this.$emit('onConfirm', bool)
      this.$refs.menuForm.resetField()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog{
  position: relative;
  .menuform{
    position: relative;
  }
}
</style>
