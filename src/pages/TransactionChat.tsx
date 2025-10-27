import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Send,
  ArrowBack,
  Person,
  ShoppingCart,
  Euro,
} from '@mui/icons-material';
import { Message, Transaction } from '../types';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const TransactionChat: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transactionId) {
      loadTransactionAndMessages();
    }
  }, [transactionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `€${numericPrice.toFixed(2)}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadTransactionAndMessages = async () => {
    if (!transactionId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Cargar transacción primero para obtener el listingId
      const transactionData = await apiService.getTransactionById(parseInt(transactionId));
      setTransaction(transactionData);

      // Luego cargar mensajes usando el listingId
      if (transactionData.listingId) {
        const messagesData = await apiService.getMessagesByListing(transactionData.listingId);
        setMessages(messagesData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar la conversación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !transaction || !user) return;

    setIsSending(true);
    setError(null);

    try {
      // Determinar el receptor del mensaje
      const receiverId = transaction.buyerId === user.id ? transaction.sellerId : transaction.buyerId;
      
      const messageData = {
        listingId: transaction.listingId,
        receiverId,
        content: newMessage.trim(),
      };

      const sentMessage = await apiService.sendMessage(messageData);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el mensaje');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOtherUser = () => {
    if (!transaction || !user) return null;
    return transaction.buyerId === user.id ? transaction.seller : transaction.buyer;
  };

  const getUserRole = () => {
    if (!transaction || !user) return '';
    return transaction.buyerId === user.id ? 'Comprador' : 'Vendedor';
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/transactions')}>
          Volver a Transacciones
        </Button>
      </Container>
    );
  }

  if (!transaction) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Transacción no encontrada
        </Alert>
      </Container>
    );
  }

  const otherUser = getOtherUser();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/transactions')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h1">
            Chat de Transacción
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conversación sobre: {transaction.listing?.cardBase?.name}
          </Typography>
        </Box>
      </Box>

      {/* Transaction Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {transaction.listing?.cardBase?.name}
            </Typography>
            <Chip
              label={formatPrice(transaction.totalPrice)}
              color="primary"
              icon={<Euro />}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" />
              <Typography variant="body2">
                <strong>{getUserRole()}:</strong> {user?.username}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" />
              <Typography variant="body2">
                <strong>{transaction.buyerId === user?.id ? 'Vendedor' : 'Comprador'}:</strong> {otherUser?.username}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingCart fontSize="small" />
              <Typography variant="body2">
                <strong>Cantidad:</strong> {transaction.quantity}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Messages */}
      <Paper sx={{ height: '500px', display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No hay mensajes aún. ¡Inicia la conversación!
              </Typography>
            </Box>
          ) : (
            <List>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    sx={{
                      flexDirection: message.senderId === user?.id ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                    }}
                  >
                    <ListItemAvatar
                      sx={{
                        order: message.senderId === user?.id ? 2 : 0,
                        ml: message.senderId === user?.id ? 2 : 0,
                        mr: message.senderId === user?.id ? 0 : 2,
                      }}
                    >
                      <Avatar sx={{ bgcolor: message.senderId === user?.id ? 'primary.main' : 'secondary.main' }}>
                        {message.sender?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        order: message.senderId === user?.id ? 1 : 1,
                        textAlign: message.senderId === user?.id ? 'right' : 'left',
                      }}
                      primary={
                        <Box
                          sx={{
                            bgcolor: message.senderId === user?.id ? 'primary.main' : 'grey.100',
                            color: message.senderId === user?.id ? 'primary.contrastText' : 'text.primary',
                            p: 1.5,
                            borderRadius: 2,
                            maxWidth: '70%',
                            display: 'inline-block',
                            wordBreak: 'break-word',
                          }}
                        >
                          {message.content}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {message.sender?.username} • {formatDate(message.createdAt)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              startIcon={isSending ? <CircularProgress size={20} /> : <Send />}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default TransactionChat;
