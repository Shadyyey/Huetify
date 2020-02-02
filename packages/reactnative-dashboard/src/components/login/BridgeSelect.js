import React, { Component } from 'react'
import { Text, View } from 'react-native'
import manager from '../../helpers/manager'
import styles from '../../styles/LoginWindowStyles'


class BridgeSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            action: 'choosing',
            selectedIP: null
        }
        this.bridges = []
        this.loadBridges()
    }
    render() {
        return <View>
            {this.bridges.map(bridge => {
                return <Text key={bridge.id} onClick={this.connectBridge.bind(this, bridge.id)} style={styles.bridge}>
                {bridge.internalipaddress}
                </Text>
            })}
        </View>
    }
    async loadBridges() {
        manager.hue.getBridges().then(bridges => {
            this.bridges = bridges
            this.setState({
                action: 'choosing'
            })            
        })
    }
    connectBridge(id) {
        let bridge = this.bridges.find(b => b.id === id)
        this.setState({
            action: 'pressing',
            timing: 0,
            bridge: bridge.internalipaddress
        })
        manager.hue.ip = bridge.internalipaddress
        this.interval = setInterval(async () => {
            if(this.state.timing === 59) {
                this.setState({
                    action: 'choosing'
                })
                clearInterval(this.interval)
                return
            }
            
            let username = await manager.hue.createUsername()
            .catch(() => {
                return
            })
            
            if(username !== undefined) {
                manager.setHueToken(username)
                // window.localStorage.setItem('hueIP', manager.hue.ip)
                // window.localStorage.setItem('hueToken', manager.hue.token)
                this.setState({
                    action: 'done'
                })
                clearInterval(this.interval)
                return
            }

            this.setState({
                action: 'pressing',
                timing: this.state.timing+1
            })
        }, 1000);
    }
}



class Bridge extends Component {
    constructor(props) {
        super(props)
        console.log(props.selected, props.ip)
    }
    render() {
        return <View style={style.bridge}>
            <Text style={style.bridgeIP}>{this.props.ip}</Text>
        </View>
    }
}