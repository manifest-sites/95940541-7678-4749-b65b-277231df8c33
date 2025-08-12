import { useState, useEffect } from 'react'
import { Card, InputNumber, Button, Divider, Row, Col, Typography, Space, Table } from 'antd'
import { CalculatorOutlined, DollarOutlined, CalendarOutlined, PercentageOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000)
  const [downPayment, setDownPayment] = useState(60000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [results, setResults] = useState(null)

  const calculateMortgage = () => {
    const principal = loanAmount - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    
    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setResults(null)
      return
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    const totalPaid = monthlyPayment * numberOfPayments
    const totalInterest = totalPaid - principal
    
    setResults({
      monthlyPayment: monthlyPayment,
      totalPaid: totalPaid,
      totalInterest: totalInterest,
      principal: principal
    })
  }

  useEffect(() => {
    calculateMortgage()
  }, [loanAmount, downPayment, interestRate, loanTerm])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const handleLogout = async () => {
    try {
      await fetch('https://db.madewithmanifest.com/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      // Redirect or refresh page after logout
      window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const summaryData = results ? [
    {
      key: '1',
      label: 'Monthly Payment',
      value: formatCurrency(results.monthlyPayment),
      icon: <DollarOutlined className="text-blue-500" />
    },
    {
      key: '2',
      label: 'Total Interest Paid',
      value: formatCurrency(results.totalInterest),
      icon: <PercentageOutlined className="text-red-500" />
    },
    {
      key: '3',
      label: 'Total Amount Paid',
      value: formatCurrency(results.totalPaid),
      icon: <CalendarOutlined className="text-green-500" />
    }
  ] : []

  const columns = [
    {
      title: '',
      dataIndex: 'icon',
      key: 'icon',
      width: 40,
      render: (icon) => icon
    },
    {
      title: 'Payment Details',
      dataIndex: 'label',
      key: 'label',
      className: 'font-medium'
    },
    {
      title: 'Amount',
      dataIndex: 'value',
      key: 'value',
      className: 'font-bold text-lg',
      align: 'right'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 relative">
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            className="absolute top-0 right-0 text-gray-600 hover:text-red-500"
          >
            Logout
          </Button>
          <Title level={1} className="flex items-center justify-center gap-3 mb-2">
            <HomeOutlined className="text-blue-600" />
            Mortgage Calculator
          </Title>
          <Text className="text-lg text-gray-600">Calculate your monthly mortgage payments and total costs</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <CalculatorOutlined className="text-blue-500" />
                  Loan Details
                </div>
              }
              className="shadow-lg"
            >
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Text strong className="block mb-2">Home Price</Text>
                  <InputNumber
                    size="large"
                    value={loanAmount}
                    onChange={setLoanAmount}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    min={1000}
                    step={1000}
                    className="w-full"
                    placeholder="Enter home price"
                  />
                </div>

                <div>
                  <Text strong className="block mb-2">Down Payment</Text>
                  <InputNumber
                    size="large"
                    value={downPayment}
                    onChange={setDownPayment}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    min={0}
                    max={loanAmount}
                    step={1000}
                    className="w-full"
                    placeholder="Enter down payment"
                  />
                  <Text className="text-sm text-gray-500 mt-1 block">
                    {loanAmount > 0 ? `${((downPayment / loanAmount) * 100).toFixed(1)}% of home price` : ''}
                  </Text>
                </div>

                <div>
                  <Text strong className="block mb-2">Interest Rate (%)</Text>
                  <InputNumber
                    size="large"
                    value={interestRate}
                    onChange={setInterestRate}
                    min={0.1}
                    max={20}
                    step={0.1}
                    precision={2}
                    className="w-full"
                    placeholder="Enter interest rate"
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </div>

                <div>
                  <Text strong className="block mb-2">Loan Term (Years)</Text>
                  <InputNumber
                    size="large"
                    value={loanTerm}
                    onChange={setLoanTerm}
                    min={1}
                    max={50}
                    step={1}
                    className="w-full"
                    placeholder="Enter loan term"
                    formatter={value => `${value} years`}
                    parser={value => value.replace(' years', '')}
                  />
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <DollarOutlined className="text-green-500" />
                  Payment Summary
                </div>
              }
              className="shadow-lg"
            >
              {results ? (
                <Space direction="vertical" size="large" className="w-full">
                  <Table
                    dataSource={summaryData}
                    columns={columns}
                    pagination={false}
                    size="large"
                    showHeader={false}
                    className="mortgage-summary-table"
                  />
                  
                  <Divider />
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Title level={4} className="mb-3 text-center">Loan Breakdown</Title>
                    <Row gutter={16}>
                      <Col span={12} className="text-center">
                        <Text className="block text-sm text-gray-600 mb-1">Principal</Text>
                        <Text strong className="text-lg text-blue-600">
                          {formatCurrency(results.principal)}
                        </Text>
                      </Col>
                      <Col span={12} className="text-center">
                        <Text className="block text-sm text-gray-600 mb-1">Interest</Text>
                        <Text strong className="text-lg text-red-500">
                          {formatCurrency(results.totalInterest)}
                        </Text>
                      </Col>
                    </Row>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <Text className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> A larger down payment reduces your monthly payment and total interest paid over the life of the loan.
                    </Text>
                  </div>
                </Space>
              ) : (
                <div className="text-center py-8">
                  <Text className="text-gray-500">Enter valid loan details to see your payment calculation</Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default MortgageCalculator