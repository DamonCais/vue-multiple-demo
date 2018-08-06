<template>
  <div>
    <el-table :header-cell-style="{background:'#666',color:'#fff'}" :show-header="false" @filter-change="filterChange" @sort-change="sortChange" stripe :data="gridData" @row-click="rowClick" style="width:100%">
      <slot name="sortIndex" />
      <el-table-column v-for="(item,index) in showData" :prop="item.prop" :key="index+1" :columnIndex="index+2" :column-key="item.prop" :filters="item.filters" :sortable="item.sortable" :label="(item.label)">
        <template slot-scope="scope">
          <div>
            <img v-if="item.type ==='image'" :src="scope.row|deepGet(item.prop)" alt="" style="width: 50px;height: 50px">
            <span v-if="item.type ==='time'">{{scope.row|deepGet(item.prop)|_formatTime}}</span>

            <span v-if="item.type ==='string'">{{scope.row|deepGet(item.prop)}}</span>
            <span v-if="item.type ==='price'">{{scope.row[item.prop]|yuan}}</span>
            <div v-if="item.type==='button'">
              <el-button @click="item.fun">{{scope.row[item.prop]}}</el-button>
            </div>
            <!-- <div v-if="item.type ==='lang'">
                            <span v-if="_(scope.row,item.prop+'.'+editlang)">
                                {{_(scope.row,item.prop+'.'+editlang)}}
                            </span>
                            <span style="color:#aaa;" v-else>
                                {{_(scope.row,item.prop+'.en')}}
                                <i style="color:#000;text-style:none;">(en)</i>
                            </span>
                        </div> -->
          </div>
        </template>
      </el-table-column>
      <slot />
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    showData: {
      type: Array
    },
    gridData: {
      type: Array
    }
  },
  data() {
    return {};
  },
  methods: {
    filterChange(e) {
      this.$emit("filterChange", e);
    },
    sortChange(e) {
      this.$emit("sortChange", e);
    },
    onClick(row) {
      this.$emit("onClick", row);
    },
    rowClick(row) {
      this.$emit("rowClick", row);
    }
  }
};
</script>

<style>
</style>
