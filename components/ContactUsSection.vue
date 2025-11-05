<template>
  <section id="contact" :class="'contact-section'">
    <h2 
      ref="titleRef"
      :class="['section-title', 'animate-on-scroll', 'fade-in-up', { 'visible': isTitleVisible }]"
    >Contact Us</h2>
    <div 
      ref="elementRef"
      :class="['contact-container', 'animate-on-scroll', 'fade-in-up', { 'visible': isVisible }]"
    >
      <div class="contact-form-container">
        <p class="contact-intro">
          Ready to discuss your legal matter? We're here to help with clear, practical advice.
        </p>
        <div class="contact-form">
          <div class="form-group">
            <input 
              type="text" 
              id="fullName" 
              v-model="form.fullName" 
              placeholder="FULL NAME" 
              :class="{ 'error': errors.fullName }"
              @blur="validateField('fullName')"
            />
            <span v-if="errors.fullName" class="error-message">{{ errors.fullName }}</span>
          </div>
          <div class="form-group">
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              placeholder="EMAIL"
              :class="{ 'error': errors.email }"
              @blur="validateField('email')"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <input 
              type="tel" 
              id="phone" 
              v-model="form.phone" 
              placeholder="PHONE"
              :class="{ 'error': errors.phone }"
              @blur="validateField('phone')"
            />
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
          </div>
          <div class="form-group">
            <select 
              id="practiceArea" 
              v-model="form.practiceArea"
              :class="{ 'error': errors.practiceArea }"
              @blur="validateField('practiceArea')"
            >
              <option value="" disabled selected>PRACTICE AREA</option>
              <option value="Family Law">Family Law</option>
              <option value="Commercial Law">Commercial Law</option>
              <option value="Immigration">Immigration</option>
              <option value="Wills & Estate">Wills & Estate</option>
            </select>
            <span v-if="errors.practiceArea" class="error-message">{{ errors.practiceArea }}</span>
          </div>
          <div class="form-group">
            <textarea 
              id="description" 
              v-model="form.description" 
              placeholder="DESCRIPTION" 
              rows="5"
              :class="{ 'error': errors.description }"
              @blur="validateField('description')"
            ></textarea>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
          </div>
          <button 
            @click="handleSubmit"
            type="button"
            class="submit-button" 
            :disabled="isSubmitting"
            style="position: relative; z-index: 100; pointer-events: auto; cursor: pointer;"
          >
            {{ isSubmitting ? 'SUBMITTING...' : 'BOOK A CONSULTATION' }}
          </button>
          
        </div>
      </div>
      
      <div class="contact-info-container">
        <h3 class="visit-title">Visit Our Office</h3>
        <div class="office-address">
          <p><b>Melbourne Legal Lawyers</b>
            <br>
            26 Hicks Street
            <br>
            Lara, VIC 3212
            <br>
            Hours: Mon-Fri 9am-5pm
          </p>
        </div>
        <div class="office-contact">
          <a href="tel:+61312345678" class="office-contact-item">
            <NuxtImg src="/images/CALL ICON.png" alt="Phone" class="office-contact-icon" />
            <span>+61 3 1234 5678</span>
          </a>
          <a href="mailto:info@melbournelegallawyers.com.au" class="office-contact-item">
            <NuxtImg src="/images/MAIL-ICON.png" alt="Email" class="office-contact-icon" />
            <span>info@melbournelegallawyers.com.au</span>
          </a>
        </div>
        <div class="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.0640524709434!2d144.4132796505789!3d-38.02228619828556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad418b6e3c84fc1%3A0x84d02d6ff0753d4c!2s26%20Hicks%20St%2C%20Lara%20VIC%203212%2C%20Australia!5e0!3m2!1sen!2sph!4v1762295620640!5m2!1sen!2sph"
            width="100%"
            height="250"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

const { isVisible: isTitleVisible, elementRef: titleRef } = useAnimateOnScroll()
const { isVisible, elementRef } = useAnimateOnScroll()

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  practiceArea: '',
  description: ''
})

const errors = ref({})
const isSubmitting = ref(false)

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8
}

const validateField = (fieldName) => {
  const value = form.value[fieldName]
  
  switch (fieldName) {
    case 'fullName':
      if (!value || value.trim().length < 2) {
        errors.value.fullName = 'Full name must be at least 2 characters'
      } else {
        delete errors.value.fullName
      }
      break
    
    case 'email':
      if (!value || value.trim().length === 0) {
        errors.value.email = 'Email is required'
      } else if (!validateEmail(value)) {
        errors.value.email = 'Please enter a valid email address'
      } else {
        delete errors.value.email
      }
      break
    
    case 'phone':
      if (!value || value.trim().length === 0) {
        errors.value.phone = 'Phone number is required'
      } else if (!validatePhone(value)) {
        errors.value.phone = 'Please enter a valid phone number'
      } else {
        delete errors.value.phone
      }
      break
    
    case 'practiceArea':
      if (!value || value.trim().length === 0) {
        errors.value.practiceArea = 'Please select a practice area'
      } else {
        delete errors.value.practiceArea
      }
      break
    
    case 'description':
      if (!value || value.trim().length < 10) {
        errors.value.description = 'Description must be at least 10 characters'
      } else {
        delete errors.value.description
      }
      break
  }
}

const validateForm = () => {
  // Validate all fields
  validateField('fullName')
  validateField('email')
  validateField('phone')
  validateField('practiceArea')
  validateField('description')
  
  // Check if form is valid
  return Object.keys(errors.value).length === 0
}

const isFormValid = computed(() => {
  return (
    form.value.fullName.trim().length >= 2 &&
    form.value.email.trim().length > 0 &&
    validateEmail(form.value.email) &&
    form.value.phone.trim().length > 0 &&
    validatePhone(form.value.phone) &&
    form.value.practiceArea.trim().length > 0 &&
    form.value.description.trim().length >= 10
  )
})

const handleSubmit = async () => {
  console.log('handleSubmit called')
  console.log('Form values:', form.value)
  console.log('isSubmitting:', isSubmitting.value)
  
  // Validate all fields before submission
  if (!validateForm()) {
    console.log('Form validation failed', errors.value)
    alert('Please fix the errors in the form')
    return
  }

  if (isSubmitting.value) {
    console.log('Already submitting')
    return
  }

  try {
    isSubmitting.value = true
    console.log('Form submitted:', form.value)
    
    // Simulate API call - replace with actual API call
    // await new Promise(resolve => setTimeout(resolve, 2000))
    
    // You can add API call here
    // const response = await $fetch('/api/contact', {
    //   method: 'POST',
    //   body: form.value
    // })
    
    // Reset form after successful submission
    form.value = {
      fullName: '',
      email: '',
      phone: '',
      practiceArea: '',
      description: ''
    }
    errors.value = {}
    
    alert('Thank you for your inquiry! We will get back to you soon.')
  } catch (error) {
    console.error('Form submission error:', error)
    alert('An error occurred. Please try again later.')
  } finally {
    isSubmitting.value = false
  }
}

</script>

<style scoped>
  .section-title {
    padding-left: 3rem;
  }
</style>

