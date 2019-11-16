<template>
  <a-locale-provider :locale="locale">
    <div class="component">
      <div class="controls">
        <a-row>
          <a-col :span="6" :push="6">
            <a-select
              defaultValue="default"
              class="full-width"
              @change="handleAddressProgramsSelect"
            >
              <a-select-option value="default" key="defaultSelectValue">Выберите Адресную Программу</a-select-option>
              <a-select-option
                v-for="ap in addressPrograms"
                :value="ap._id"
                :key="ap._id"
              >{{ap.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6" :push="6">
            <a-range-picker @change="handleDateRangePicker" />
          </a-col>
        </a-row>
      </div>

      <div class="content">
        <a-row>
          <a-col :span="24">
            <a-table
              v-if="selectedAddressProgramId"
              :columns="columns"
              :dataSource="addressProgramWithRows.rows"
              :pagination="pagination"
              :rowKey="record => record._id"
              @change="handleTableChange"
              bordered
            >
              <template slot="humanReadableTimestamp-slot" slot-scope="text, record, index">
                <div>{{text}}</div>
              </template>
              <template slot="title-slot" slot-scope="text, record, index">
                <div>
                  <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="e => updateTitleVuex({_id: record._id, title: e.target.value})"
                  />
                  <template v-else>{{text}}</template>
                </div>
              </template>
              <template slot="totalRowCount-slot" slot-scope="text, record, index">
                <div>{{text}}</div>
              </template>
              <template slot="actions-slot" slot-scope="text, record, index">
                <div class="editable-row-operations">
                  <span v-if="record.editable">
                    <a @click="() => updateTitle(record._id)">Сохранить</a>
                    <a @click="() => cancelEditRow(record._id, 'cancel')">Отменить</a>
                  </span>
                  <span v-else>
                    <a @click="() => editRow(record._id)">Редактировать</a>
                    <a-popconfirm
                      title="Уверены, что хотите удалить АП?"
                      @confirm="() => deleteRow(record._id)"
                    >
                      <a>Удалить</a>
                    </a-popconfirm>
                  </span>
                </div>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-locale-provider>
</template>

<script lang="ts">
const columns = [
  {
    title: 'Дата получения отчёта',
    dataIndex: 'humanReadableTimestamp',
    width: '17%',
    scopedSlots: { customRender: 'humanReadableTimestamp-slot' },
  },
  {
    title: 'Город',
    dataIndex: 'city',
    width: '13%',
    scopedSlots: { customRender: 'city-slot' },
    filters: <Array<any>>[],
  },
  {
    title: 'Адрес',
    dataIndex: 'address',
    scopedSlots: { customRender: 'address-slot' },
  },
  {
    title: 'Действия',
    dataIndex: 'actions',
    width: '15%',
    scopedSlots: { customRender: 'actions-slot' },
  },
]

const pagination: any = {
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '20', '30', '40'],
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number, range: Array<number>) => {
    console.info('showTotal', total, range)
    return `${range[0]}-${range[1]} из ${total}`
  },
}

import { Component, Watch, Vue } from 'vue-property-decorator'
import { Action, Getter, Mutation } from 'vuex-class'
import AddressProgram from '../types/AddressProgram'

@Component({})
export default class ViewReports extends Vue {
  file: any = {}
  isUploading = false
  columns = columns
  pagination = pagination
  filters = {}
  sorter = {}
  selectedAddressProgramId: string = ''
  timeRangeStart = 0
  timeRangeEnd = 0

  @Getter('locale') locale!: object
  @Getter('addressProgramsCount') addressProgramsCount!: number
  @Getter('addressPrograms') addressPrograms!: Array<AddressProgram>
  @Getter('addressProgramWithRows') addressProgramWithRows!: AddressProgram
  @Action('getAddressPrograms') getAddressPrograms!: (payload?: object) => void
  @Action('getAddressProgramWithRows') getAddressProgramWithRows!: (payload?: object) => void

  @Watch('$route', { immediate: true, deep: true })
  onUrlChange(newVal: any) {
    this.setupListeners()
    this.reloadAddressPrograms()

    // TODO: for easy debugging
    this.handleAddressProgramsSelect('5dcf91748cb1c659e6046e2a')
  }

  setupListeners() {
    const channel = this.$socket.channel('reloadAddressPrograms')
    if (!channel.isSubscribed()) {
      channel.subscribe()
      channel.unwatch(this.reloadAddressPrograms)
      channel.watch(this.reloadAddressPrograms)
    }
  }

  async reloadAddressPrograms(options?: object) {
    if (!options) {
      options = { pagination: this.pagination, filters: this.filters, sorter: this.sorter }
    }
    await this.getAddressPrograms(options)
    this.pagination.total = this.addressProgramsCount

    const { total, current, pageSize } = this.pagination
    const shouldSwitchPage = (current - 1) * pageSize >= total
    if (shouldSwitchPage) {
      this.pagination.current = (current - 1)
      await this.reloadAddressPrograms()
    }
  }

  async reloadAddressProgramWithRows(options?: object) {
    if (!options) {
      options = {
        _id: this.selectedAddressProgramId,
        pagination: this.pagination,
        filters: this.filters,
        sorter: this.sorter,
      }
    }
    await this.getAddressProgramWithRows(options)
    this.pagination.total = this.addressProgramWithRows.queriedRowCount

    const { total, current, pageSize } = this.pagination
    const shouldSwitchPage = (current - 1) * pageSize >= total
    if (shouldSwitchPage) {
      this.pagination.current = (current - 1)
      await this.getAddressProgramWithRows()
    }


    const cityColumn = this.columns.find(col => col.dataIndex === 'city')
    if (cityColumn) {
      cityColumn.filters = []
      for (const [city, cityRowCount] of Object.entries(this.addressProgramWithRows.cities)) {
        if (cityColumn && cityColumn.filters) {
          const cityFilterRecord: { text: string, value: string } = { text: city, value: city }
          cityColumn.filters.push(cityFilterRecord)
        }
      }
    }
  }

  editRow(_id: string) {
    this.$store.commit('toggleAddressProgramEditableVuex', { _id, editable: true })
  }

  cancelEditRow(_id: string, cancel?: 'cancel') {
    this.$store.commit('toggleAddressProgramEditableVuex', { _id, editable: false, cancel })
  }

  updateTitleVuex(payload: { _id: string, title: string }) {
    this.$store.commit('updateAddressProgramTitleVuex', payload)
  }

  async updateTitle(_id: string) {
    await this.$store.dispatch('updateAddressProgramTitle', _id)
    this.cancelEditRow(_id)
  }

  async deleteRow(_id: string) {
    await this.$store.dispatch('deleteAddressProgram', _id)
  }

  handleTableChange(pagination: any, filters: object, sorter: object) {
    console.info('handleTableChange', pagination, filters, sorter)
    this.pagination = pagination
    this.filters = filters
    this.sorter = sorter
    this.reloadAddressProgramWithRows({ _id: this.selectedAddressProgramId, pagination, filters, sorter })
  }

  handleDateRangePicker(range: any) {
    this.timeRangeStart = range[0].format('x')
    this.timeRangeEnd = range[1].format('x')
    // TODO: reloadAddressProgramRows
    console.info('handleDateRangePicker', this.timeRangeStart, this.timeRangeEnd)
  }

  handleAddressProgramsSelect(value: string) {
    this.selectedAddressProgramId = value
    if (value === 'default') {
      this.selectedAddressProgramId = ''
    }
    this.reloadAddressProgramWithRows()
  }
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>