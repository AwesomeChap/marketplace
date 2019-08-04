import React, { useEffect, useState } from 'react';
import { LiteTitle } from '../../Helper/ChoiceCards';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, Collapse, Icon, message  } from 'antd';
import { setConfig } from '../../../redux/actions/actions';
import uuidv4 from 'uuid/v4';
import axios from 'axios'; 
import Loader from '../../Helper/Loader';
import UploadImage from '../../Helper/UploadImage';
import "../../../../node_modules/video-react/dist/video-react.css"
import { Player } from 'video-react'; 

const { Panel } = Collapse;

const VideoForm = (props) => {
  const { form } = props;
  const { getFieldDecorator, setFieldValue, validateFields } = form;

  const videoFormOptions = {
    rules: [{ required: true, message: "required!" }]
  }

  const handleSaveVideo = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (!props.video) {
          values = { ...values, key: uuidv4() };
        }
        else{
          values = {...values, key : props.video.key}
        }
        props.handleSaveVideo(values);
      }
    })
  }

  return (
    <Form onSubmit={handleSaveVideo}>
      <Form.Item label="Title">
        {getFieldDecorator("title", {
          ...videoFormOptions,
          initialValue: !!props.video ? props.video.question : undefined
        })(
          <Input />
        )}
      </Form.Item>
      <UploadImage limit={1} form={form} label={"Thumb Nail"} name={"thumbnail"} options={{ ...videoFormOptions, initialValue: !!props.video ? props.video.thumbnail : undefined }} />
      <UploadImage limit={1} form={form} label={"Video Clip"} name={"clip"} options={{ ...videoFormOptions, initialValue: !!props.video ? props.video.clip : undefined }} />
      <Form.Item>
        <Button type="primary" loading={props.loading} htmlType="submit">Save</Button>
      </Form.Item>
    </Form>
  )
}

const WrappedVideoForm = Form.create({ name: "Video" })(VideoForm);

const Video = (props) => {
  const [visible, setVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = (data) => {
    setLoading(true);
    axios.post('/config', { prop: "videos", values: data, userId: props.user._id }).then(({ data }) => {
      setLoading(false);

      let updatedConfig = { ...props.config, videos: data.config };
      props.setConfig(updatedConfig);
      setVisible(false);
      setCurrentVideo(null);

      return message.success(data.message);
    }).catch((e) => {
      return message.error(e.message);
    })
  }

  const handleSaveVideo = (value) => {
    let dataClone = [...props.config.videos];
    if (!!currentVideo) {
      const index = props.config.videos.indexOf(currentVideo);
      dataClone[index] = value;
    }
    else {
      dataClone = [...dataClone, value];
    }
    postData(dataClone);
  }

  const handleDeleteVideo = (key) => {
    const updatedVideos = [...props.config.videos].filter((d) => d.key !== key);
    postData(updatedVideos);
  }

  const handleEditVideo = (key) => {
    const video = [...props.config.videos].find(el => el.key == key);
    console.log(video);
    setCurrentVideo(video);
    setVisible(true);
  }

  return (
    <Loader loading={loading}>
      <div className="menu-item-page center-aligned-flex">
        <LiteTitle title="Video" />
        <Button onClick={() => setVisible(true)} size="large" shape="round" type="primary" icon="plus">Add</Button>
        <Modal width={700} visible={visible} centered={true} footer={null} onCancel={() => setVisible(false)}
          maskClosable={false} destroyOnClose={true} title={!!currentVideo ? "Edit Video" : "Create Video"} >
          <WrappedVideoForm loading={loading} handleSaveVideo={handleSaveVideo} video={currentVideo} />
        </Modal>
        <Collapse style={{ width: "100%", marginTop: 16 }}>
          {props.config.videos.map((d) => {

            const operations = (
              <>
                <Icon onClick={() => handleEditVideo(d.key)} style={{ paddingRight: 16, paddingLeft: 16 }} type="edit" />
                <Icon onClick={() => handleDeleteVideo(d.key)} theme="twoTone" twoToneColor="#ff4d4f" type="delete" />
              </>
            )

            return < Panel key={d.key} header={d.title} extra={operations} >
              <Player
                playsInline
                poster={d.thumbnail[0].thumbUrl}
                src={d.clip[0].response.url}
              />
            </Panel>
          })}
        </Collapse>
      </div>
    </Loader>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setConfig })(Video);

