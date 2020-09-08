/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from 'react'
import { Grid, Row, Col, Table } from 'react-bootstrap'
import Card from 'components/Card/Card.jsx'
import { thArray, tdArray } from 'variables/Variables.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import '../assets/sass/TableList.scss'
import Loader from 'react-loader-spinner'

class TableList extends Component {
  state = {
    users: [],
    allowedValues: {
      _id: 'Id',
      firstName: 'First Name',
      email: 'Email',
    },
    currEdit: null,
    editName: '',
    load: false,
    mainLoader: true,
  }

  componentDidMount() {
    let getUrl = 'http://18.188.185.178:3002/get/candidate'
    axios.get(getUrl).then((res) => {
      this.setState({
        users: res.data.data,
        mainLoader: false,
      })
    })
  }

  setCurrentEdit = (id, name) => {
    if (this.state.load) return
    this.setState({ currEdit: id, editName: name })
  }

  onNameEdit = (e) => {
    this.setState({ editName: e.target.value })
  }

  onUpdate = () => {
    const { currEdit, editName, users } = this.state
    if (!editName.length) return toast.error("Name can't be empty")
    let putUrl = 'http://18.188.185.178:3002/put/candidate'
    this.setState({
      load: true,
    })
    axios
      .put(putUrl, {
        id: currEdit,
        set: {
          firstName: editName,
        },
      })
      .then((res) => {
        let userId = users.findIndex((item) => item._id === currEdit)
        users[userId] = res.data.data
        this.setState({ users, currEdit: null, editName: '', load: false })
      })
  }

  render() {
    const {
      users,
      allowedValues,
      currEdit,
      editName,
      load,
      mainLoader,
    } = this.state
    return (
      <div className="content">
        <ToastContainer type="warning" />
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Striped Table with Hover"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {Object.keys(allowedValues).map((key, idx) => (
                          <th key={key}>{allowedValues[key]}</th>
                        ))}
                      </tr>
                    </thead>
                    {mainLoader ? (
                      <div className="loading-box">
                        <Loader
                          type="Oval"
                          color="rgb(200,200,200)"
                          height={70}
                          width={70}
                          className="main-loader"
                        />
                      </div>
                    ) : (
                      <tbody>
                        {users.map((item, index) => (
                          <tr key={index}>
                            {Object.keys(allowedValues).map((key, idx) => {
                              if (allowedValues[key]) {
                                return currEdit === item._id &&
                                  key === 'firstName' ? (
                                  <td key={idx}>
                                    <input
                                      value={editName}
                                      onChange={this.onNameEdit}
                                    />
                                  </td>
                                ) : (
                                  <td
                                    style={{
                                      width: key === '_id' ? '10%' : '30%',
                                    }}
                                    key={idx}
                                  >
                                    {key === '_id'
                                      ? index + 1
                                      : item[key]
                                      ? item[key]
                                      : 'NOT PRESENT'}
                                  </td>
                                )
                              } else {
                                return null
                              }
                            })}
                            {currEdit === item._id ? (
                              <td className="tableFieldCont">
                                {load ? (
                                  <button className="btn btn-fill btn-success lg t-btn">
                                    updating...
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-fill btn-success lg t-btn"
                                    onClick={this.onUpdate}
                                  >
                                    Update
                                  </button>
                                )}
                              </td>
                            ) : (
                              <td className="tableFieldCont">
                                <button
                                  className="btn btn-fill btn-info lg t-btn"
                                  onClick={() =>
                                    this.setCurrentEdit(
                                      item._id,
                                      item.firstName
                                    )
                                  }
                                >
                                  Edit
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </Table>
                }
              />
            </Col>

            <Col md={12}>
              <Card
                plain
                title="Striped Table with Hover"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tdArray.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default TableList
