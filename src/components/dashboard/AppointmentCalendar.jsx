import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns';
import { getTherapistAvailability, getAppointments, bookAppointment } from '../../services/firestoreService';

const AppointmentCalendar = ({ therapist, userId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [error, setError] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState('video');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Mock data for availability and appointments
  useEffect(() => {
    const fetchAppointmentsAndAvailability = async () => {
      try {
        setLoadingAppointments(true);
        setLoadingAvailability(true);
        
        // In a real implementation, you'd fetch from Firestore
        setTimeout(() => {
          // Mock appointments
          const mockAppointments = [
            {
              id: 'appt1',
              therapistId: therapist?.id || 'therapist123',
              clientId: userId,
              date: new Date(2025, 3, 28), // April 28, 2025
              startTime: '14:00',
              endTime: '14:50',
              type: 'video',
              status: 'confirmed'
            },
            {
              id: 'appt2',
              therapistId: therapist?.id || 'therapist123',
              clientId: userId,
              date: new Date(2025, 4, 5), // May 5, 2025
              startTime: '10:00',
              endTime: '10:50',
              type: 'video',
              status: 'confirmed'
            }
          ];
          
          // Mock availability (therapist available Mon-Fri 9am-5pm)
          const mockAvailability = {
            monday: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
            tuesday: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
            wednesday: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
            thursday: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
            friday: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
          };
          
          setAppointments(mockAppointments);
          setAvailability(mockAvailability);
          setLoadingAppointments(false);
          setLoadingAvailability(false);
        }, 1000);
        
        // Real implementation would be:
        // const appointmentsResponse = await getAppointments(userId, therapist.id);
        // const availabilityResponse = await getTherapistAvailability(therapist.id);
        // if (appointmentsResponse.success && availabilityResponse.success) {
        //   setAppointments(appointmentsResponse.data);
        //   setAvailability(availabilityResponse.data);
        // } else {
        //   setError(appointmentsResponse.error || availabilityResponse.error);
        // }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointment information');
      }
    };
    
    if (userId && therapist) {
      fetchAppointmentsAndAvailability();
    }
  }, [userId, therapist]);
  
  // Handle previous month navigation
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Handle next month navigation
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Render header with month and navigation
  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <button onClick={prevMonth} className="month-nav">
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={nextMonth} className="month-nav">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };
  
  // Render days of week
  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEEEE';
    const startDate = startOfWeek(currentMonth);
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="day-name">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    
    return <div className="days-row">{days}</div>;
  };
  
  // Check if a date has an appointment
  const hasAppointment = (day) => {
    return appointments.some(appt => isSameDay(parseISO(appt.date.toISOString()), day));
  };
  
  // Check if a date is available (weekday and in therapist's availability)
  const isDateAvailable = (day) => {
    const dayOfWeek = format(day, 'EEEE').toLowerCase();
    const isWeekday = !['saturday', 'sunday'].includes(dayOfWeek);
    const hasAvailableSlots = availability[dayOfWeek] && availability[dayOfWeek].length > 0;
    
    return isWeekday && hasAvailableSlots;
  };
  
  // Render cells for each day in month view
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, 'd');
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const hasAppt = hasAppointment(day);
        const isAvailable = isDateAvailable(day);
        
        days.push(
          <div
            key={day.toString()}
            className={`day-cell ${!isCurrentMonth ? 'disabled' : ''} ${
              isToday ? 'today' : ''
            } ${isSelected ? 'selected' : ''} ${
              hasAppt ? 'has-appointment' : ''
            } ${isAvailable && isCurrentMonth ? 'available' : ''}`}
            onClick={() => {
              if (isCurrentMonth && isAvailable) {
                setSelectedDate(cloneDay);
                setShowTimeSlots(true);
                setSelectedTimeSlot(null);
              }
            }}
          >
            <span className="day-number">{formattedDate}</span>
            {hasAppt && <div className="appointment-dot"></div>}
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="days-row">
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className="calendar-body">{rows}</div>;
  };
  
  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase();
    return availability[dayOfWeek] || [];
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };
  
  // Handle appointment type selection
  const handleTypeSelect = (type) => {
    setAppointmentType(type);
  };
  
  // Handle booking appointment
  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTimeSlot) return;
    
    try {
      setIsBooking(true);
      
      // Format end time (50 minute sessions)
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
      const endHours = hours + (minutes + 50 >= 60 ? 1 : 0);
      const endMinutes = (minutes + 50) % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      // Create appointment object
      const appointmentData = {
        therapistId: therapist.id,
        clientId: userId,
        date: selectedDate,
        startTime: selectedTimeSlot,
        endTime: endTime,
        type: appointmentType,
        status: 'confirmed'
      };
      
      // In real implementation, send to Firestore
      // const { success, data, error } = await bookAppointment(appointmentData);
      
      // For demo, simulate success
      setTimeout(() => {
        setAppointments([...appointments, { ...appointmentData, id: `appt-${Date.now()}` }]);
        setBookingSuccess(true);
        setIsBooking(false);
        
        // Reset after success message
        setTimeout(() => {
          setShowTimeSlots(false);
          setSelectedTimeSlot(null);
          setBookingSuccess(false);
        }, 3000);
      }, 1500);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('Failed to book appointment');
      setIsBooking(false);
    }
  };
  
  if (loadingAppointments || loadingAvailability) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading calendar...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="calendar-error">
        <div className="error-message">
          <p>{error}</p>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="appointment-calendar-container">
      <div className="appointment-calendar">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      
      {showTimeSlots && (
        <div className="time-slot-container">
          <div className="time-slot-header">
            <h3>Available Times for {format(selectedDate, 'EEEE, MMMM d')}</h3>
            <button 
              className="close-button"
              onClick={() => setShowTimeSlots(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {bookingSuccess ? (
            <div className="booking-success">
              <i className="fas fa-check-circle"></i>
              <h4>Appointment Booked!</h4>
              <p>
                Your {appointmentType} session has been scheduled for{' '}
                {format(selectedDate, 'EEEE, MMMM d')} at {selectedTimeSlot}.
              </p>
            </div>
          ) : (
            <>
              <div className="time-slots">
                {getAvailableTimeSlots().map((timeSlot) => (
                  <button
                    key={timeSlot}
                    className={`time-slot ${selectedTimeSlot === timeSlot ? 'selected' : ''}`}
                    onClick={() => handleTimeSlotSelect(timeSlot)}
                  >
                    {timeSlot}
                  </button>
                ))}
              </div>
              
              {selectedTimeSlot && (
                <div className="appointment-details">
                  <h4>Session Details</h4>
                  
                  <div className="appointment-type-selector">
                    <button
                      className={`type-option ${appointmentType === 'video' ? 'selected' : ''}`}
                      onClick={() => handleTypeSelect('video')}
                    >
                      <i className="fas fa-video"></i>
                      <span>Video</span>
                    </button>
                    <button
                      className={`type-option ${appointmentType === 'audio' ? 'selected' : ''}`}
                      onClick={() => handleTypeSelect('audio')}
                    >
                      <i className="fas fa-phone-alt"></i>
                      <span>Audio</span>
                    </button>
                    <button
                      className={`type-option ${appointmentType === 'chat' ? 'selected' : ''}`}
                      onClick={() => handleTypeSelect('chat')}
                    >
                      <i className="fas fa-comments"></i>
                      <span>Chat</span>
                    </button>
                  </div>
                  
                  <div className="appointment-summary">
                    <p>
                      <strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p>
                      <strong>Time:</strong> {selectedTimeSlot} - {selectedTimeSlot.split(':')[0]}:50
                    </p>
                    <p>
                      <strong>Session Type:</strong> {appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)}
                    </p>
                    <p>
                      <strong>Therapist:</strong> {therapist?.name || 'Your Therapist'}
                    </p>
                  </div>
                  
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleBookAppointment}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Booking...
                      </>
                    ) : (
                      'Confirm Appointment'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      <div className="upcoming-appointments">
        <h3>Your Upcoming Appointments</h3>
        
        {appointments.length > 0 ? (
          <div className="appointment-list">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-date">
                  <div className="date-badge">
                    <div className="month">
                      {format(appointment.date, 'MMM')}
                    </div>
                    <div className="day">
                      {format(appointment.date, 'd')}
                    </div>
                  </div>
                </div>
                
                <div className="appointment-details">
                  <h4>{format(appointment.date, 'EEEE')}, {appointment.startTime} - {appointment.endTime}</h4>
                  <p>
                    <span className="appointment-type">
                      <i className={`fas fa-${
                        appointment.type === 'video' ? 'video' : 
                        appointment.type === 'audio' ? 'phone-alt' : 'comments'
                      }`}></i>
                      {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)} Session
                    </span>
                    <span className="appointment-with">
                      with {therapist?.name || 'Your Therapist'}
                    </span>
                  </p>
                </div>
                
                <div className="appointment-actions">
                  <button className="btn btn-outline btn-sm">
                    <i className="fas fa-pencil-alt"></i>
                    Reschedule
                  </button>
                  <button className="btn btn-outline btn-sm text-danger">
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments">
            <p>You don't have any upcoming appointments. Use the calendar to schedule a session.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendar;