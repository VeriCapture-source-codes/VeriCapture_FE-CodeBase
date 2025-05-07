import React from 'react';
import { Card, Button } from 'react-bootstrap';

const FeedCard = ({ user, time, location, text, image, tag, likes, comments, shares }) => {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          <img src={user.avatar} alt={user.name} width="40" className="rounded-circle me-2" />
          <div>
            <div className="fw-bold">{user.name}</div>
            <small className="text-muted">{time} • {location}</small>
          </div>
          <span className={`badge bg-danger ms-auto`}>{tag}</span>
        </div>
        <Card.Text>{text}</Card.Text>
        <Card.Img src={image} className="rounded mb-2" />
        <div className="d-flex justify-content-between text-muted">
          <span><i className="bi bi-heart me-1" />{likes}</span>
          <span><i className="bi bi-chat me-1" />{comments}</span>
          <span><i className="bi bi-eye me-1" />{shares}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FeedCard;
