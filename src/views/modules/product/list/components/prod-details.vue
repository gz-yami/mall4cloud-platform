<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    top="0"
    class="component-prod-details"
    width="1100px"
    title="商品详情"
    @close="closeDialog"
  >
    <div class="mod-prod-info release-goods">
      <!-- <div class="title">商品信息</div> -->
      <el-form
        ref="dataFormRef"
        class="part-form"
        :model="dataForm"
        label-width="110px"
      >
        <div class="info-box">
          <!-- 1.商品基本信息 -->
          <div class="part-content">
            <div class="part-tit">
              <span class="part-tit-num">1</span><span class="part-tit-name">商品基本信息</span>
            </div>
            <!-- 商品平台分类（不可修改） -->
            <div class="part-form-div">
              <div class="part-form-item-tit">
                平台分类
              </div>
              <div class="part-form-item">
                <div class="classify-show">
                  <category-group
                    :selected-categories="selectedCategories"
                    :show-category-select-btn="showCategorySelectBtn"
                    :single="true"
                    @select-or-revise-category="selectOrReviseCategory('platform')"
                  />
                </div>
              </div>
            </div>

            <!-- 商品店铺分类 -->
            <div class="part-form-div">
              <div class="part-form-item-tit">
                店铺分类
              </div>
              <div class="part-form-item">
                <div class="classify-show">
                  <span v-if="dataForm.shopCategory">{{ dataForm.shopCategory.pathNames[0] }} > {{
                    dataForm.shopCategory.name }}</span>
                </div>
              </div>
            </div>

            <!-- 商品标题 -->
            <el-form-item
              label="商品标题"
              prop="name"
            >
              <el-input
                v-model="dataForm.name"
                :readonly="true"
                placeholder="商品标题组成：商品描述+属性"
                :disabled="!dataForm.categoryId"
                style="width:90%"
              />
            </el-form-item>
            <!-- 商品卖点 -->
            <el-form-item
              label="商品卖点"
              prop="sellingPoint"
            >
              <el-input
                v-model="dataForm.sellingPoint"
                :readonly="true"
                type="textarea"
                placeholder="商品卖点"
                :disabled="!dataForm.categoryId"
                style="width:90%"
              />
            </el-form-item>
            <!-- 商品品牌 -->
            <el-form-item label="所属品牌">
              <div class="brand">
                <img
                  v-if="brandImgUrl"
                  :src="brandImgUrl"
                  class="brand-img"
                >
                <el-tag
                  v-if="brandName"
                  class="br"
                  :disable-transitions="true"
                  @close="handleCloseBrand()"
                >
                  <span class="brandname">{{ brandName }}</span>
                </el-tag>
              </div>
            </el-form-item>
            <!-- 商品基本属性 -->
            <el-form-item
              v-if="basicAttrs.length > 0"
              label="基本属性"
            >
              <div class="text">
                请准确填写属性，有利于商品在搜索和推荐中露出，错误填写可能面临商品下架或流量损失！（注：带<span class="stars-icon" />为重要属性，必填）
              </div>
              <spu-category-attrs
                :attrs-list="basicAttrs"
                @get-value-of-basic-attrs="getValueOfBasicAttrs"
              />
            </el-form-item>
            <!-- 商品排序 -->
            <el-form-item label="商品排序">
              <el-input
                v-model.number="dataForm.seq"
                :readonly="true"
                :max="32767"
                oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                placeholder="请输入商品排序"
                :min="1"
                validate-event
                style="width:200px"
              />
            </el-form-item>
            <!-- 商品主图 -->
            <div class="part-form-div">
              <div class="part-form-item-tit">
                商品主图
              </div>
              <div
                v-if="dataForm.mainImgUrl"
                class="part-form-item"
              >
                <img
                  :src="(dataForm.mainImgUrl).indexOf('http') === -1 ? resourcesUrl + dataForm.mainImgUrl : dataForm.mainImgUrl"
                  class="main-img"
                  @click="picturePreview(dataForm.mainImgUrl)"
                >
                <!-- <img-upload v-model="dataForm.mainImgUrl" /> -->
              </div>
            </div>
            <!-- 商品轮播图 -->
            <div class="part-form-div">
              <div class="part-form-item-tit">
                商品轮播图
              </div>
              <div
                v-if="dataForm.imgUrls"
                class="part-form-item"
              >
                <div
                  v-for="(item, idx) in dataForm.imgUrls"
                  :key="idx"
                  class="imgs"
                >
                  <img
                    :src="(item).indexOf('http') === -1 ? resourcesUrl + item : item"
                    class="main-img"
                    @click="picturePreview(item)"
                  >
                </div>
                <!-- <imgs-upload v-model="dataForm.imgUrls" /> -->
                <div class="banner-tips">
                  建议图片尺寸为 800*800，可拖动排序，最多上传9张
                </div>
              </div>
            </div>
          </div>

          <!-- 2.商品sku与库存 -->
          <div class="part-content">
            <div class="part-tit">
              <span class="part-tit-num">2</span><span class="part-tit-name">商品销售属性与库存</span>
            </div>
            <div class="part-form-div">
              <div class="part-form-item-tit">
                销售属性
              </div>
              <div class="part-form-item">
                <!-- <div class="part-tips">最多添加两个商品属性，第一个商品属性可添加属性图片</div> -->
                <!-- sku-组件 -->
                <sku-block
                  v-model="salesAttrs"
                  :save-sales-attrs="originalSalesAttrs"
                  :sku-tree="originalSkuTree"
                  :on-fetch-group="fetchSkuTree"
                  :on-fetch-sku="fetchSku"
                  :on-create-sku="createSku"
                  :on-create-group="createGroup"
                  :on-preview-img="picturePreview"
                  :category-id="dataForm.shopCategoryId"
                  @on-change="changeSkuGroupData"
                />
              </div>
            </div>
            <!-- 价格及库存 -->
            <div class="part-form-div">
              <div class="part-form-item-tit">
                价格及库存
              </div>
              <div class="setup-spec">
                <div class="imp-tips">
                  请如实填写库存信息，以确保商品可以在承诺发货时间内发出，避免可能的物流违规
                </div>
                <div class="sku-table">
                  <!-- sku表格 -->
                  <sku-table
                    :data="salesAttrs"
                    :flatten="flatten"
                    :is-no-sku-value="isNoSkuValue"
                    :spu-id="parseInt(dataForm.spuId)"
                    :is-category-id="dataForm.categoryId ? true : false"
                    @on-change-data="handleChangeData"
                  />
                </div>
              </div>
            </div>
            <div class="part-form-div">
              <div class="part-form-item-tit">
                总库存
                <el-tooltip
                  class="item"
                  effect="light"
                  content="每个属性库存的总和"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
              </div>
              <el-input
                v-model="dataForm.totalStock"
                :readonly="true"
                style="width:150px"
              />
            </div>
          </div>

          <!-- 3.商品详情 -->
          <div class="part-content">
            <div class="part-tit">
              <span class="part-tit-num">3</span><span class="part-tit-name">商品详情</span>
            </div>
            <div class="part-form-info">
              <product-details
                :data-form="dataForm"
                :detail="detail"
              />
            </div>
          </div>
        </div>

        <!-- 图片预览 -->
        <picture-preview
          v-if="picturePreviewVisible"
          ref="picturePreviewRef"
        />
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/prod-info'
import { categoryPage } from '@/api/product/category'
import Big from 'big.js'
import skuBlock from '@/components/Sku/SkuBlock/index.vue'
import SkuTable from '@/components/Sku/SkuTable/index.vue'

const route = useRoute()
const Data = reactive({
  visible: false,
  resourcesUrl: import.meta.env.VITE_APP_RESOURCES_URL,
  dataForm: {
    spuId: route.query.spuId || null, // 商品id
    categoryId: null, // 分类id
    shopCategoryId: null, // 店铺分类id
    name: '', // 商品名称
    sellingPoint: '', // 商品卖点
    brandId: 0, // 品牌id（非必选）
    imgUrls: '', // 轮播图 多个图片逗号分隔
    isCompose: 0, // 是否为组合商品0普通商品，1组合商品
    mainImgUrl: '', // 商品主图
    hasSkuImg: 0, // sku是否含有图片 0无 1有
    scoreFee: 0, // 积分价格（非必填）
    seq: null, // 商品排序（非必填）
    spuAttrValues: [], // 商品属性值列表
    deliveryMode: {
      hasShopDelivery: true,
      hasUserPickUp: false,
      hasCityDelivery: false
    }, // 配送方式
    deliveryTemplateId: '', // 运费模板id
    detail: '', // 详情信息（非必填）
    skuList: [], // sku列表
    totalStock: 0 // 商品总库存
  },
  backTotalStock: null, // 回显总库存
  brandName: '', // 品牌名称
  brandImgUrl: '', // 品牌logo
  basicAttrs: [], // 基本属性列表
  salesAttrs: [], // 销售属性列表
  originalSalesAttrs: [], // 起初的(不变的)销售属性
  selectedCategories: [], // 选中的平台分类
  showCategorySelectBtn: true, // '选择分类'按钮显隐
  transportTemplates: [], // 运费模板列表
  spuAttrValueList: [], // 商品基本属性值列表
  value: null,
  skuTree: [],
  sku: [],
  content: '',
  skuTableData: [], // sku表格返回数据
  originalSkuTree: [], // sku属性选项列表(不受改变影响)
  flatten: [],
  originalSpuAttrValueList: [], // 基本属性回显原数据
  isNoSkuValue: false, // 回显时的商品是否有sku
  picturePreviewVisible: false, // 预览图片弹窗
  detail: null // 商品详情回显
})

const { visible, resourcesUrl, dataForm, brandName, brandImgUrl, basicAttrs, salesAttrs, originalSalesAttrs, selectedCategories, showCategorySelectBtn, originalSkuTree, flatten, isNoSkuValue, picturePreviewVisible, detail } = toRefs(Data)

const dataFormRef = ref()
const init = (spuId) => {
  Data.visible = true
  Data.dataForm.spuId = spuId || ''
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!spuId) {
      return
    }
    api.getProdInfoPage(spuId).then(data => {
      Data.dataForm = data
      Data.originalSpuAttrValueList = data.spuAttrValues
      Data.backTotalStock = data.skus.reduce((res, { stock }) => {
        res += (stock || 0)
        return res
      }, 0)
      // 商品轮播图
      Data.dataForm.imgUrls = data.imgUrls.split(',')
      // 回显分类
      getCategoryBack(data.categoryId)
      // 商品分类选择按钮
      Data.showCategorySelectBtn = false
      if (data.brand?.imgUrl) {
        Data.brandImgUrl = (data.brand.imgUrl).indexOf('http') === -1 ? Data.resourcesUrl + data.brand.imgUrl : data.brand.imgUrl // 品牌图片
      }
      Data.brandName = data.brand?.name // 品牌名字
      // 根据分类获取基本属性列表
      getAttrsByCategoryId(data.categoryId, data.spuAttrValues)
      // sku回显
      skuBackShow(data.skus) // 销售属性
      // 商品详情
      Data.detail = formatHtml(Data.dataForm.detail)
    })
  })
}

/**
 * 获取分类
 */
const getCategoryBack = (categoryId) => {
  let selectedOfPlatCategory = {}
  categoryPage().then(data => {
    // 获取平台分类数据
    const categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
    selectedOfPlatCategory = idList(categoryList, categoryId, 'categoryId', 'children').reverse()
    selectedOfPlatCategory.forEach(el => Data.selectedCategories.push(el.name)) // 选中的分类
  })
}

/**
     * 根据分类获取基本属性列表
     */
const getAttrsByCategoryId = (categoryId, spuAttrValues) => {
  const param = {
    categoryId,
    attrType: 1 // 基本属性
  }
  api.getAttrsByCategoryId(param).then((data) => {
    // 获取数据回显
    if (spuAttrValues) {
      data.forEach((attr, idx) => {
        spuAttrValues.forEach(spuAttr => {
          if (!attr.attrValues.length && (!spuAttr.attrValueId || spuAttr.attrValueId === 0)) {
            if (attr.attrId === spuAttr.attrId) {
              attr.attrValue = spuAttr.attrValueName
            }
          } else {
            if (attr.attrValues.some(attr => spuAttr.attrValueId === attr.attrValueId)) {
              attr.attrValue = spuAttr.attrValueId
            }
          }
        })
      })
    }
    Data.basicAttrs = data
  })
}

/**
     * 基本属性数据
     */
const getValueOfBasicAttrs = (attrsList, attrs, st) => {
  const originalSpuAttrValueList = Data.originalSpuAttrValueList
  const spuAttrValueList = Data.spuAttrValueList
  const spuAttrValue = {}
  if (Data.dataForm.spuId) { // 回显
    originalSpuAttrValueList.forEach((item, index) => {
      if (item.attrId === attrs.attrId) {
        attrs.spuAttrValueId = item.spuAttrValueId
        spuAttrValue.spuAttrValueId = attrs.spuAttrValueId
      }
    })
  }
  // 获取基本属性子组件返回数据
  spuAttrValue.attrId = attrs.attrId
  spuAttrValue.attrName = attrs.name
  if (st === 0) { // 下拉选择
    attrs.attrValues.forEach(attr => {
      if (attrs.attrValue === attr.attrValueId) {
        spuAttrValue.attrValueId = attrs.attrValue
        spuAttrValue.attrValueName = attr.value
        spuAttrValueList.push(spuAttrValue)
        return true
      }
    })
  }
  if (st === 1) { // 输入框
    spuAttrValue.attrValueId = ''
    spuAttrValue.attrValueName = attrs.attrValue
    if (attrs.searchType === 1 && !attrs.attrValue) {
      ElMessage({
        message: '当前属性为必填属性，请填写属性值！',
        duration: 1500
      })
      return
    } else {
      spuAttrValueList.push(spuAttrValue)
    }
  }
  // 去重
  removeDuplication(spuAttrValueList, 'attrId')
  Data.dataForm.spuAttrValues = spuAttrValueList
}

/**
     * sku回显
     */
const skuBackShow = (skus) => {
  if (skus && skus.length > 0) {
    const salesAttrs = []
    const ids = []
    const attrValueNameMapId = []
    skus.forEach(sku => {
      sku.spuSkuAttrValues?.forEach((attrInfo, idx) => {
        // 无sku
        if (attrInfo.attrName === null && attrInfo.attrValueName === null) {
          Data.isNoSkuValue = true
          return
        }

        /** 有sku */

        const randomId = 'random_'

        /** left的每一项 */
        // 每一层id一致
        ids[idx] = ids[idx] || attrInfo.attrId || randomId + parseInt(Math.random() * 100, 10) + 1 // 无attrId则随机生成一个带有前缀的新id
        attrInfo.attrId = ids[idx]

        if (!attrValueNameMapId[idx]) {
          attrValueNameMapId[idx] = {}
        }

        const attrValueId = attrValueNameMapId[idx][attrInfo.attrValueName] || attrInfo.attrValueId || randomId + parseInt(Math.random() * 100, 10) + parseInt(Math.random() * 100, 10)
        attrValueNameMapId[idx][attrInfo.attrValueName] = attrValueId
        attrInfo.attrValueId = attrValueId
        const skuValueItem = {
          id: attrValueId,
          is_show: !!sku.imgUrl,
          text: attrInfo.attrValueName
        }

        if (idx === 0) {
          skuValueItem.imgUrl = sku.imgUrl || ''
        }
        if (salesAttrs[idx] === undefined) {
          salesAttrs[idx] = {
            id: ids[idx],
            leaf: [skuValueItem],
            text: attrInfo.attrName
          }
        } else {
          salesAttrs[idx].leaf.push(skuValueItem)
        }
      })
    })

    // 去重
    salesAttrs.forEach(attr => {
      attr.leaf = removeDuplication(attr.leaf, 'id')
    })
    skus.forEach(skuItem => {
      skuItem.marketPriceFee = parseFloat(bigActualTotal(parseFloat(skuItem.marketPriceFee), 100)) // 市场价
      skuItem.priceFee = parseFloat(bigActualTotal(parseFloat(skuItem.priceFee), 100)) // 销售价
    })
    skus.forEach((skuItem, i) => {
      Data.flatten[i] = skuItem
    })
    salesAttrs.forEach((attr, i) => {
      Data.salesAttrs[i] = attr
    })
  }
  querySalesAttrData(skus)
}

/**
     * 获取店铺中的销售属性
     */
const querySalesAttrData = (skus) => {
  if (!skus) {
    Data.originalSalesAttrs.splice(0, Data.originalSalesAttrs.length)
  }
  Data.skuTree.splice(0, Data.skuTree.length) // 清空
}

// 去重
const removeDuplication = (items, validKey) => {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i][validKey] === items[j][validKey]) {
        items.splice(i, 1)
        j--
      }
    }
  }
  return items
}

const fetchSkuTree = () => {
  // 异步获取规格列表
  return new Promise(resolve => {
    resolve(Data.skuTree)
  })
}

const fetchSku = (id) => {
  // 异步获取规格可选值
  return new Promise(resolve => {
    resolve(getSkus(id))
  })
}

// 获取规格可选值
const getSkus = (id) => {
  Data.sku = []
  Data.originalSalesAttrs.forEach(attr => {
    if (id === attr.attrId) {
      attr.attrValues.forEach(attrVal => {
        const attrValue = {}
        attrValue.text = attrVal.value
        attrValue.id = attrVal.attrValueId
        Data.sku.push(attrValue)
      })
    }
  })
  return Data.sku
}

const createGroup = (text) => {
  // 创建新的规格名
  return new Promise((resolve, reject) => {
    const randomId = 'random_'
    if (text) {
      resolve(randomId + parseInt(Math.random() * 100, 10) + 1)
    } else {
      reject(new Error())
    }
  })
}

const createSku = (data) => {
  // 创建新的规格值
  return new Promise((resolve, reject) => {
    const randomId = 'random_'
    resolve(data.data.map(item => {
      return {
        id: randomId + parseInt(Math.random() * 100, 10) + parseInt(Math.random() * 100, 10),
        text: item,
        leaf: []
      }
    }))
  })
}

// SkuGroup返回数据
const changeSkuGroupData = (data) => {
  // console.log('SkuGroup返回data:', data)
  Data.skuTree = data
  data?.[0]?.leaf.forEach(attr => {
    if (attr.is_show) {
      Data.dataForm.hasSkuImg = 1
    } else {
      Data.dataForm.hasSkuImg = 0
    }
  })
}

// SkuTable返回数据
const handleChangeData = (data) => {
  Data.skuTableData = data
  const salePrices = []
  const marketPrices = []
  let totalStock = 0
  Data.skuTableData?.forEach((sku, idx) => {
    if (!sku.marketPriceFee) {
      sku.marketPriceFee = 0
    }
    if (sku.stock) {
      totalStock += Number(sku.stock) // 库存累加
    }
    salePrices.push(sku.priceFee) // 售价
    marketPrices.push(sku.marketPriceFee) // 市场价
  })
  if (Data.dataForm.skus) {
    Data.dataForm.skus.forEach(() => {
      Data.dataForm.changeStock = totalStock - Data.backTotalStock
    })
  }
  Data.dataForm.priceFee = Math.min.apply(null, salePrices) // 最低价-售价
  Data.dataForm.marketPriceFee = Math.min.apply(null, marketPrices) // 最低价-市场价
  Data.dataForm.totalStock = totalStock // 总库存
}

// 关闭dialog
const closeDialog = () => {
  Data.dataForm = {
    spuId: null, // 商品id
    categoryId: null, // 分类id
    shopCategoryId: null, // 店铺分类id
    name: '', // 商品名称
    sellingPoint: '', // 商品卖点
    brandId: 0, // 品牌id（非必选）
    imgUrls: '', // 轮播图 多个图片逗号分隔
    isCompose: 0, // 是否为组合商品0普通商品，1组合商品
    mainImgUrl: '', // 商品主图
    hasSkuImg: 0, // sku是否含有图片 0无 1有
    scoreFee: 0, // 积分价格（非必填）
    seq: null, // 商品排序（非必填）
    spuAttrValues: [], // 商品属性值列表
    deliveryMode: {
      hasShopDelivery: true,
      hasUserPickUp: false,
      hasCityDelivery: false
    }, // 配送方式
    deliveryTemplateId: '', // 运费模板id
    detail: '', // 详情信息（非必填）
    skuList: [], // sku列表
    totalStock: 0 // 商品总库存
  }
  Data.detail = null
  Data.salesAttrs = []
  Data.basicAttrs = []
  Data.transportTemplates = []
  Data.brandName = '' // 品牌名称
  Data.brandImgUrl = '' // 品牌logo
  Data.selectedCategories = []
}

// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}

const picturePreviewRef = ref()
// 图片预览
const picturePreview = (imgUrl) => {
  Data.picturePreviewVisible = true
  nextTick(() => {
    picturePreviewRef.value.init(imgUrl)
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>

.component-prod-details {

  .part-form {
    max-height: 780px;
    overflow: auto;
  }

  .part-form::-webkit-scrollbar {
    display: none;
  }
  .mod-prod-info.release-goods {
    color: #606266;

    // 三角形样式
    .stars-icon {
      display: inline-block;
      width: 12px;
      height: 8px;
    }

    .stars-icon::before {
      position: absolute;
      content: "";
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 8px solid#ff7300;
    }

    .info-box {
      max-width: 1200px;
      margin: 0 auto;
      border: 1px solid #eee;
      margin-bottom: 20px;

      .part-content {

        // 品牌
        .brand {
          display: flex;
          align-items: center;

          .brand-img {
            display: inline-block;
            margin-right: 6px;
            width: auto;
            max-width: 60px;
            height: auto;
            max-height: 40px;
          }

          .br {
            margin-right: 20px;
          }
        }

        padding: 20px;

        .part-tit {
          margin-bottom: 20px;

          .part-tit-num {
            color: #02a1e9;
            font-size: 25px;
            font-style: italic;
            /* 斜体 */
          }

          .part-tit-name {
            font-size: 15px;
            margin: 0 10px;
          }
        }

        /* part内容 */
        .part-form-div {
          display: flex;
          align-items: top;
          font-size: 14px;
          margin-bottom: 22px;

          .part-form-item-tit {
            width: 110px;
            min-width: 110px;
            text-align: right;
            padding-right: 14px;
            line-height: 36px;
            box-sizing: border-box;
          }

          .part-form-item {
            width: 100%;

            // 轮播图&主图
            .imgs {
              display: inline-block;
            }

            .imgs:not(:first-child) {
              margin-left: 8px;
            }

            img.main-img {
              display: block;
              width: 120px;
              height: 120px;
              padding: 5px;
              border: 1px dashed #d9d9d9;
              border-radius: 6px;
            }

            img.main-img:hover {
              cursor: pointer;
            }

            // 分类
            .classify-show {
              line-height: 36px;
            }

            // 轮播图
            .banner-tips {
              margin-top: 10px;
              font-size: 13px;
              color: #999;
            }
          }

          /* 价格及库存 */
          .setup-spec {
            width: 100%;
            background: #fafafa;
            padding: 15px;
            max-width: 900px;

            .imp-tips {
              font-size: 13px;
              color: #ec6b01;
              margin-bottom: 5px;
            }

            .sku-table {
              margin-top: 15px;
            }
          }
        }

        /* 属性面板 */
        .text {
          position: relative;
          min-width: 200px;
          color: #888;
          line-height: 36px;

          .stars-icon::before {
            // top: 15px;
            margin-left: 2px;
          }
        }
      }

      .part-content:not(:first-child) {
        border-top: 1px solid #eee;
      }
    }
  }
}
</style>
