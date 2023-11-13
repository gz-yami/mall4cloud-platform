<template>
  <div class="component-category-group">
    <div class="category classify-show">
      <div
        v-if="selectedCategories.length > 0 & single"
        class="category-sel1 classify"
      >
        <!-- 商品详情/分类 -->
        <span v-if="selectedCategories[0]">{{ selectedCategories[0] }}</span>
        <span v-if="selectedCategories[1]">&nbsp;>&nbsp;{{ selectedCategories[1] }}</span>
        <span v-if="selectedCategories[2]">&nbsp;>&nbsp;{{ selectedCategories[2] }}</span>
      </div>
      <div
        v-if="showCategorySelectBtn && single"
        class="change-category change-classify"
        @click="selectOrReviseCategory"
      >
        {{ selectedCategories.length ? '修改' : '选择' }}分类
      </div>
      <!-- 品牌/属性 -->
      <div
        v-if="selectedCategories.length > 0 & multiple"
        class="category-sel2"
      >
        <p
          v-for="(item, index) in selectedCategories"
          :key="index"
        >
          <span v-if="item.firstCategoryName">{{ item.firstCategoryName }}</span>
          <span v-if="item.secondCategoryName">&nbsp;>&nbsp;{{ item.secondCategoryName }}</span>
          <span v-if="item.threeCategoryName">&nbsp;>&nbsp;{{ item.threeCategoryName }}</span>
          <span
            class="del-cate"
            @click="deleteCategoryItemOfSelected(index)"
          >×</span>
        </p>
      </div>
      <div
        v-if="multiple"
        class="change-category"
        @click="selectOrReviseCategory"
      >
        选择分类
      </div>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['selectOrReviseCategory', 'deleteCategoryItemOfSelected'])

defineProps({
  selectedCategories: {
    type: Array,
    default () {
      return []
    }
  },
  showCategorySelectBtn: {
    type: Boolean,
    default () {
      return true
    }
  },
  multiple: {
    type: Boolean,
    default () {
      return false
    }
  },
  single: {
    type: Boolean,
    default () {
      return false
    }
  }
})

// 选择/修改分类
const selectOrReviseCategory = () => {
  emit('selectOrReviseCategory')
}

// 删除
const deleteCategoryItemOfSelected = (index) => {
  emit('deleteCategoryItemOfSelected', index)
}

</script>

<style lang="scss" scoped></style>
