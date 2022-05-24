import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Popconfirm } from 'antd';
import BookDescription from 'components/BookDescription';
import InvitePartner from 'components/InvitePartner';
import NewBook from 'components/NewBook';
import RenameBook from 'components/RenameBook';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useStore } from 'stores';
import { v4 as uuidv4 } from 'uuid';
import './index.scss';


const { Meta } = Card;


const Book = () => {

  const bookCarousel = useRef()
  const { bookStore } = useStore()

  useEffect(() => {
    bookStore.getBookInfoList()
    bookStore.getBookRecentDetailList(moment().format("YYYY-MM-01"))
  }, [])


  // carousel card action
  const nextCarouselElement = () => bookCarousel.current.next()
  const prevCarouselElement = () => bookCarousel.current.prev()

  const afterCarouselChange = (index) => {
    bookStore.setCarouselBookInfoByIdx(index)
    bookStore.setCarouselBookRecentDetailByIdx(index)
  }

  const DeleteBookButton = ({ bookInfo }) => {
    const [visible, setVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const { bookStore } = useStore()

    const onConfirmDelete = async () => {
      setConfirmLoading(true)
      await bookStore.deleteBook(bookInfo)
      setConfirmLoading(false)
      setVisible(false)
    }

    return (
      <Popconfirm
        title="Delete this book?"
        visible={visible}
        onConfirm={onConfirmDelete}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={() => setVisible(false)}
        icon={<WarningOutlined style={{ color: 'red' }} />}
      >
        <DeleteOutlined style={{ color: 'red' }} onClick={() => setVisible(true)} />
      </Popconfirm>
    );
  };

  return (
    <>
      <NewBook className='book-header' />

      <div className='content-wrapper'>
        {/* Carousel */}
        <div className="book-carousel-wrapper">
          <Button type='text' className='carousel-arrow-left' onClick={prevCarouselElement}>{"<"}</Button>
          <Carousel
            className="book-carousel"
            dotPosition="top"
            ref={bookCarousel}
            afterChange={afterCarouselChange}
          >
            {bookStore.bookInfoList.map(bookInfo => (
              <Card
                key={uuidv4()}
                className="carousel-element"
                style={{ width: 240 }}
                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                actions={
                  bookInfo.canUserEdit ?
                    [
                      <InvitePartner key="invite" bookInfo={bookInfo} />,
                      <RenameBook key="edit" bookInfo={bookInfo} />,
                      <DeleteBookButton key="deleteBook" bookInfo={bookInfo} />,
                    ] : []
                }
              >
                <Meta
                  title={bookInfo.bookName}
                  description={
                    <>
                      <div>Author: {bookInfo.authorNickname}</div>
                      <div>Created: {moment(new Date(bookInfo.createTime)).format("YYYY-MM-DD")}</div>
                    </>
                  }
                />
              </Card>
            ))}
          </Carousel>
          <Button type='text' className='carousel-arrow-right' onClick={nextCarouselElement}>{">"}</Button>
        </div>

        {/* Description */}
        <BookDescription />
      </div>
    </>
  )
}

export default observer(Book)
