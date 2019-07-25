import React, {useState, useEffect} from 'react';
import { Button, Modal } from 'antd';
import FoodItemModal from './FoodItemModal';
import axios from 'axios';

const FoodItemsTab = (props) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});

  useEffect(()=>{
    
  },[])

  const handleSaveFoodItem = (foodItems) => {
      console.log(foodItems);
  }

  const handleCancel = () => setVisible(false); 

  return (
    <div className="menu-item-page">
      <Button onClick={()=>setVisible(true)} type="primary">Add Food Item</Button>
      <Modal width={700} visible={visible} centered={true} footer={null}
        onCancel={handleCancel} maskClosable={false} destroyOnClose={true}>
        <FoodItemModal done={() => setVisible(false)} loading={loading}
          handleSaveFoodItem={handleSaveFoodItem} foodItemData={{}}/>
      </Modal>
    </div>
  )
}

export default FoodItemsTab;