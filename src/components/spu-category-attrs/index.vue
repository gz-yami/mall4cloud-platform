<template>
  <div class="component-spu-catagory-attrs">
    <div class="part-section">
      <div
        v-for="(attrs, attrIdx) in attrsList"
        :key="attrIdx"
        class="part-sec-item"
      >
        <div class="flx">
          <div class="sec-tit">
            <span
              v-if="attrs.searchType == 1"
              class="stars-icon"
            />
            <span class="name">{{ attrs.name }}</span>
          </div>
          <el-select
            v-if="attrs.attrValues.length"
            v-model="attrs.attrValue"
            placeholder="请选择"
            style="width:230px"
            @change="getValueOfBasicAttrs(attrs, 0)"
          >
            <el-option
              v-for="item in attrs.attrValues"
              :key="item.attrValueId"
              disabled
              :label="item.value"
              :value="item.attrValueId"
            />
          </el-select>
          <el-input
            v-else
            v-model="attrs.attrValue"
            :readonly="true"
            style="width:230px"
            @blur="getValueOfBasicAttrs(attrs, 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['getValueOfBasicAttrs'])
defineProps({
  attrsList: {
    type: Array,
    default () {
      return []
    }
  }

})

const getValueOfBasicAttrs = (attrs, st) => {
  emit('getValueOfBasicAttrs', attrs, st)
}

</script>

<style lang="scss" scoped>
.component-spu-catagory-attrs {
  width: 100%;
  .part-section {
    background: #f9f9f9;
    padding: 20px;
    padding-bottom: 0;
    text-align: left;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    .part-sec-item {
      display: inline-block;
      width: 48%;
      margin-bottom: 20px;
      margin-right: 10px;
      .flx {
        display: flex;
        align-items: center;
        .sec-tit {
          position: relative;
          margin-right: 15px;
          width: auto;
          text-align: right;
          line-height: 1.5em;
          // 三角形样式
          .stars-icon {
            display: inline-block;
            width: 12px;
            height: 8px;
          }
          .stars-icon::before {
            position: absolute;
            top: 16px;
            left: 0;
            content: "";
            width: 0;
            height: 0;
            margin-top: -10px;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 8px solid #ff7300;
          }
        }
      }
    }
    .part-sec-item:nth-child(2n) {
      margin-right: 0;
    }
  }
}
</style>
