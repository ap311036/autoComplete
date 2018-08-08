import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ActRajax from './index.js';
import SearchInput from './components/SearchInput';
// import IcRcln from '../ic_rcln/components/Module';
import '../core/core.scss';
class Preview extends Component {
    constructor (props) {
        super(props);
        this.state = {
            data: [],
            searchKeyWord: '',
            selectText: '',
            isFocus: false,
            show: true,
            showText: Math.random() > 0.5 ? '請先點選出發地' : ''
        };
        this.fetchData = this.fetchData.bind(this);
        this.AbortController = null;
    }
    _inputOnChangeHandler (value) {
        let self = this;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            self.fetchData(value);
        }, 500);
    }
    fetchData (value) {
        // inputOnChange直接觸發fetch事件
        // 先清空 state 裡的 data
        // 如果有上一次發出的請求，立即執行取消abort()
        // fetch成功後，將資料回調給processData fn
        // this.setState({ data: [], selectText: value });
        this.AbortController && this.AbortController.abort();
        this.AbortController = new AbortController();
        const signal = this.AbortController.signal;

        // let url = new URL('https://uhotel.liontravel.com/search/keyword');
        // let encodedValue = encodeURI(value);
        // url.searchParams.append('KeyWord', encodedValue);

        let url = 'https://tun-hsiang.000webhostapp.com/ajax.php?keyWord=' + value;
        // console.log(url)
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            signal,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }),
        })
            .then(res => {
                return res.json();
            })
            .then(d => this.processData(d, value))
            .catch(res => console.error('request has error', res));
    }
    clearWord (value) {
        this.setState({ selectText: value });
    }
    isFocus (bool) {
        let show = false;
        if (!this.state.show) {
            show = true;
        }
        this.setState({ isFocus: bool, show: true });
    }
    processData (data, searchKeyWord) {
        // Destinations 是 fetch的第一個key name
        let p = new Promise(function (resolve, reject) {
            data.Destinations.map((item) => {
                item.level1 = item.Kind;
                item.level2 = item.KindName;
                item.level3 = item.Code;
                item.txt = item.Name;
                delete item.Kind;
                delete item.KindName;
                delete item.Code;
                delete item.Name;
            });
            resolve(data);
        });
        this.setState({ data: data.Destinations, searchKeyWord: searchKeyWord });
        return p;
    }
    render () {
        return (
            <div>
                <SearchInput
                    containerClass="int_rcln blue request"
                    labelClass=""
                    inputClass=""
                    keyWord={this.state.selectText}
                    clearWord={(value) => this.clearWord(value)}
                    onChange={(value) => this._inputOnChangeHandler(value)}
                    isFocus={(bool) => this.isFocus(bool)}
                />
                <ActRajax
                    containerClass={(!this.state.show && 'd-no')}
                    sectionClass={''}
                    itemClass={''}
                    titleClass={''}
                    data={this.state.data}
                    matchWord={this.state.searchKeyWord}
                    closeBtnOnClick={() => this.setState({ show: false })}
                    getItemClickValue={(v) => this.setState({ selectText: v.txt })}
                    isFocus={this.state.isFocus}
                    showText={''}
                    noMatchText="很抱歉，找不到符合的項目"
                    minimumStringQuery={'請至少輸入兩個字'}
                    minimumStringQueryLength={2}
                    footer={true}
                    rules={
                        [
                            {
                                title: '城市',
                                icon: <i className="far fa-building"></i>
                            },
                            {
                                title: '區域',
                                icon: <i className="fas fa-flag"></i>
                            },
                            {
                                title: '行政區',
                                icon: <i className="fas fa-flag"></i>
                            },
                            {
                                title: '商圈',
                                icon: <i className="fas fa-map-marked-alt"></i>
                            },
                            {
                                title: '地標',
                                icon: <i className="fas fa-map-pin"></i>
                            },
                            {
                                title: '飯店',
                                icon: <i className="fas fa-hotel"></i>
                            }
                        ]
                    }
                ></ActRajax>
            </div>
        );
    }
}

ReactDOM.render(
    <Preview />,
    document.getElementById('root')
);