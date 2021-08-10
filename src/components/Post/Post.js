import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Share from '@material-ui/icons/Share'
import Edit from '@material-ui/icons/Edit'
import Chip from '@material-ui/core/Chip'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useAuth } from 'base-shell/lib/providers/Auth'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const getPostData = (post) => {
  const { elements = [] } = post || {}
  let title = ''
  let description = ''
  let thumbnail = ''

  for (let i = 0; i < elements.length; i++) {
    const e = elements[i]
    if (e.title) {
      title = e.value
    }
    if (e.description) {
      description = e.value
    }
    if (e.type === 'image') {
      thumbnail = e.thumbnail || e.downloadURL
    }

    if (title && description && thumbnail) {
      return { title, description, thumbnail }
    }
  }
  return { title, description, thumbnail }
}

const handleShare = ({ key, title, text }) => {
  if (navigator.share) {
    let url = `https://${document.location.hostname}/posts/view/${key}`

    navigator
      .share({
        title,
        text,
        url,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error))
  } else {
    console.log('no share API')
  }
}

const Post = ({ uid, val, handlePostClick, index }) => {
  const history = useHistory()
  const intl = useIntl()
  const { auth } = useAuth()
  const { post = {}, author = {}, timestamp = moment(), forPost = false, publishedOn = false } = val
  const { title = '', description = '', thumbnail = '/background.jpg' } = getPostData(post)
  const { displayName, photoURL, uid: authorUid } = author
  const key = uid
  const matches = useMediaQuery('(min-width:800px)')

  const handleProfileClick = () => {
    //history.push(`/profiles/${authorUid}`)
  }

  const handleEdit = () => {
    if (forPost) {
      history.push(`/user_comments/edit/${uid}`)
    } else {
      history.push(`/user_posts/edit/${uid}`)
    }
  }

  return (
    <Card key={key} elevation={6} style={{ height: 415, margin: 12 }}>
      <div style={{ display: 'flex', flexDirection: matches ? 'row' : 'column' }}>
        <div style={{ flex: 0.5 }}>
          <CardHeader
            style={{ padding: 14, cursor: 'pointer' }}
            avatar={<Avatar onClick={handleProfileClick} src={photoURL} aria-label="recipe" />}
            action={
              navigator.share ? (
                <IconButton aria-label="settings" onClick={() => handleShare({ key, title, text: description })}>
                  <Share color="primary" />
                </IconButton>
              ) : null
            }
            title={
              <div onClick={handleProfileClick}>
                {displayName}
                {publishedOn ? null : (
                  <Chip
                    style={{ marginLeft: 14 }}
                    size="small"
                    label={intl.formatMessage({ id: 'draft' })}
                    color="secondary"
                    variant="outlined"
                  />
                )}
              </div>
            }
            subheader={
              <div onClick={handleProfileClick}>
                <div>{moment(timestamp).format('DD.MM.YYYY HH:mm')}</div>
              </div>
            }
          />

          <CardContent
            style={{ cursor: 'pointer', padding: 14, height: 79 }}
            onClick={handlePostClick ? () => handlePostClick(key, val, index) : undefined}
          >
            <Typography variant="h6" component="p">
              {title.substring(0, 30)}
              {title && title.length > 30 && '...'}
            </Typography>
            <Typography gutterBottom variant="body2" color="textSecondary" style={{ textAlign: 'justify' }}>
              {description.substring(0, 70)}
              {description && description.length > 70 && '...'}
            </Typography>
          </CardContent>
          <CardActions style={{ padding: 0, paddingLeft: 8 }}>
            {authorUid === auth.uid && (
              <IconButton aria-label="acceptedComment" onClick={handleEdit}>
                <Edit color="primary" />
              </IconButton>
            )}
          </CardActions>
        </div>

        <CardMedia
          onClick={handlePostClick ? () => handlePostClick(key, val, index) : undefined}
          component="img"
          style={{ height: 420, width: 'auto', overflow: 'auto', cursor: 'pointer', borderRadius: 8 }}
          image={thumbnail || '/background.jpg'}
          title="Main image"
        />
      </div>
    </Card>
  )
}

export { getPostData }
export default Post
