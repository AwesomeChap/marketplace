import React from 'react';
import { Row, Col, Card, Button, Select } from 'antd';
import CategoryView from '../../../Helper/GenericCategoryView';

const RestaurantFilters = props => {
  React.useEffect(() => console.log(props.filterOptions), [])
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Card>
          <div className="space-between-center" >
            {["Veg", "Non Veg", "Both"].map((type, i) => (
              <Button style={{ padding: 0 }} key={`food-type-${i + 1}`} className={type === props.filterOptions.foodType ? "selected-food-type" : undefined} onClick={() => props.handleChange({ ...props.filterOptions, foodType: type })} type="link">{type}</Button>
            ))}
          </div>
        </Card>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Card>
          <div className="space-between-center" >
            <span>Spice Level</span>
            <Select value={props.filterOptions.spiceLevel.value} placeholder="Choose spice level" onChange={value => props.handleChange({...props.filterOptions, spiceLevel: {value, options: props.filterOptions.spiceLevel.options}})} allowClear style={{ width: 120 }}>
              {props.filterOptions.spiceLevel.options.map((opt, i) => <Select.Option key={`spice-level-${i + 1}`} value={opt}>{opt}</Select.Option>)}
            </Select>
          </div>
        </Card>
      </div>
      <div style={{ marginBottom: 16 }}>
        {!!props.filterOptions.categories.options.main.length && <CategoryView name="Categories" categories={props.filterOptions.categories.value} handleChange={(value) => props.handleChange({ ...props.filterOptions, categories: {...props.filterOptions.categories, value} })} dataSource={props.filterOptions.categories.options} />}
      </div>
    </>
  )
}

export default RestaurantFilters;