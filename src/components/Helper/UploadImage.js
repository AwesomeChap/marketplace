import React, { useState, useEffect } from "react";
import { Form, Upload, Modal, Icon } from "antd";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const UploadImage = props => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadButtonVisible, setUploadButtonVisible] = useState(true);

  const { getFieldDecorator } = props.form;

  const normFile = e => {
    console.log("Upload event:", e);
    if (!!props.limit) if (e.fileList.length >= props.limit) setUploadButtonVisible(false);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleCancel = () => setPreviewVisible(false);

  const uploadButton = (
    <div>
      <Icon type="plus" />
    </div>
  );

  return (
    <React.Fragment>
      <Form.Item label={props.label}>
        {getFieldDecorator(props.name, {
          valuePropName: "fileList",
          getValueFromEvent: normFile
        })(
          <Upload
            onPreview={handlePreview}
            name="logo"
            listType="picture-card"
            action="/upload"
            onRemove={file => {
              setUploadButtonVisible(true);
            }}
          >
            {uploadButtonVisible ? uploadButton : null}
          </Upload>
        )}
      </Form.Item>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </React.Fragment>
  );
};

export default UploadImage;
