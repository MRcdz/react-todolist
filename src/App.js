import './App.css'
import React, { createContext } from 'react'
import { Input, Table, Popconfirm, Button, message } from 'antd'
import axios from 'axios';


const { Provider } = createContext()
const { Search } = Input

class App extends React.Component {
  state = {
    value: "",
    data: '我是来自 app 的数据！',
    datasource: [],
    columns: [
      { title: '任务序号', dataIndex: 'id', key: 'id' },
      { title: '任务名称', dataIndex: 'name', key: 'name' },
      { title: '任务描述', dataIndex: 'des', key: 'des' },
      {
        title: '操作',
        dataIndex: 'setting',
        key: 'setting',
        render: (_, record) => this.state.datasource.length >= 1 ? (
          <Popconfirm
            title="是否删除？"
            onConfirm={() => this.delHandler(record.id)}
            okText="是"
            cancelText="否"
          >
            <a href='#!'>删除</a>
          </Popconfirm>
        ) : null
      }
    ]
  }

  getB = d => this.setState({ data: d })

  onSearch = value => {
    // 接口数据
    // if(value.trim() !== '') {
    //   axios.get(`http://localhost:8080/search/${value}`).then(res =>
    //   this.setState({datasource: res.data}))
    // } else {
    //   this.loadList()
    // }

    // 本地数据
    if (value.trim() !== '') {
      const newDatas = this.state.datasource.filter(item => item.name.toLowerCase().startsWith(value.trim().toLowerCase()))
      this.setState({ datasource: newDatas })
    } else {
      this.loadList()
    }
  }

  loadList = () => {
    // 接口数据
    // axios.get('http://localhost:8080/api').then(res => {
    //   this.setState({
    //     datasource: res.data
    //   })
    // })

    // 本地数据
    axios.get('/todoLists.json').then(res => {
      this.setState({
        datasource: res.data
      })
    })
  }

  delHandler = (record) => {
    // 删除接口
    // axios.delete(`http://localhost:8080/api/${record}`).then(res => {
    //   this.setState({
    //     datasource: res.data.filter(item => item.id !== record)
    //   })
    // })

    // axios 请求本地删除
    // axios.get('/todoLists.json').then(res => {
    //   this.setState({
    //     datasource: res.data.filter(item => item.id !== record)
    //   })
    //   message.success('删除成功', .5)
    // })
    // let data_src = this.state.datasource
    // console.log(record);
    this.setState({
      datasource: this.state.datasource.filter(item => item.id !== record).map(item => {
        console.log(item.id);
        // 遍历每一个id ，如果id > 当前的 record ，那么后面的id重新排序即可。
        if (item.id > record) {
          item.id--
        }
        return {
          ...item
        }
      })
    })
    message.info('删除成功', .5)
  }

  componentDidMount() {
    this.loadList()
  }

  onAdd = (e) => {
    if (e && e.trim() !== '') {
      this.setState({
        datasource: [...this.state.datasource,
        {
          "id": this.state.datasource.length + 1,
          "key": this.state.datasource.length + 1,
          "name": e,
          "des": "你的添加：" + e
        }]
      })
      console.log(e.length);
    }
  }

  Add = () => {
    let name = document.querySelector('.name')
    let des = document.querySelector('.desc')
    if (name.value.trim() !== '' && des.value.trim() !== '') {
      this.setState({
        datasource: [...this.state.datasource, {
          id: this.state.datasource.length + 1,
          key: this.state.datasource.length + 1,
          name: name.value,
          des: des.value
        }]
      })
      message.success('添加成功', .5)
    } else {
      name.value = ''
      des.value = ''
      name.focus()
    }
  }


  render() {
    return (
      // Provider 提供数据 value 到 Consumer
      <Provider value={this.state.data}>
        <div style={{ width: '700px', margin: '30px auto' }}>
          <h1 style={{ textAlign: 'center', color: '#448EF7' }}>React 实战之 TodoLists</h1>
          <div style={{
            display: 'flex',
            marginBottom: '20px'
          }}>
            <div className='addtodo' style={{ display: 'flex' }}>
              <Input className='name' placeholder='输入名称' style={{ width: '200px', marginRight: '10px' }} />
              <Input
                className='desc'
                placeholder='输入任务描述'
                style={{
                  borderRight: '0',
                  borderTopRightRadius: '0',
                  borderBottomRightRadius: '0'
                }} />
              <Button type='primary' size='large' style={{
                //左上
                borderTopLeftRadius: '0px',
                //左下
                borderBottomLeftRadius: '0px'
              }} onClick={this.Add}>添加</Button>
            </div>
            <Search
              style={{ width: '400px', marginLeft: '20px' }}
              placeholder="输入关键词"
              allowClear
              enterButton="搜索"
              size="large"
              onSearch={this.onSearch}
            />
          </div>
          <Table
            dataSource={this.state.datasource}
            columns={this.state.columns}
            bordered
          />
        </div>
      </Provider>
    )
  }
}


export default App;
