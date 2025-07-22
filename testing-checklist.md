# BIFA Gestiune - Testing Checklist for Quasar v2 Migration

## Overview
This document provides a comprehensive testing checklist for all features that must be verified after migrating from Quasar v1/Vue 2 to Quasar v2/Vue 3.

## 1. Authentication & Access Control

### 1.1 Login System
- [ ] Regular login page (`/login`) loads correctly
- [ ] AKY login page (`/aky`) loads correctly
- [ ] Username/password validation works
- [ ] Successful login redirects to dashboard
- [ ] Failed login shows error notification
- [ ] JWT token is stored in localStorage
- [ ] Logout functionality clears token and redirects
- [ ] Protected routes redirect to login when not authenticated
- [ ] Session persistence works on page refresh

### 1.2 User Management (`/utilizatori`)
- [ ] Page loads with user list
- [ ] Add user dialog opens and closes
- [ ] User creation with all fields works
- [ ] Password validation (min 5 chars) shows errors
- [ ] User deletion shows confirmation and works
- [ ] Table sorting by columns works
- [ ] Real-time table updates after CRUD operations
- [ ] Only admin users can access this page

## 2. Inventory Management

### 2.1 Warehouses/Gestiuni (`/gestiuni`)
- [ ] Page loads with warehouse cards
- [ ] Add warehouse dialog works
- [ ] Edit warehouse functionality
- [ ] Delete warehouse with confirmation
- [ ] Default user assignment dropdown loads users
- [ ] Reception committee tab switching
- [ ] Inventory committee tab switching
- [ ] President and member selection for committees
- [ ] Save committee assignments
- [ ] Card UI displays all information correctly

### 2.2 Categories (`/categorii`)
- [ ] Page loads with category list
- [ ] Filter by material type (dropdown works)
- [ ] Add category dialog
- [ ] Edit category inline
- [ ] Delete category
- [ ] Category assignment to warehouses
- [ ] Table pagination if many categories

### 2.3 Locations (`/locuri`)
- [ ] Page loads with location list
- [ ] Add location functionality
- [ ] Edit location
- [ ] Delete location
- [ ] Hierarchical location display
- [ ] Location search/filter

### 2.4 Materials (`/materiale`)
- [ ] Page loads with material list
- [ ] Add material dialog with all fields
- [ ] Material code validation
- [ ] Unit of measure selection
- [ ] Price entry with decimal support
- [ ] Edit material information
- [ ] Delete material
- [ ] Search materials by name/code
- [ ] Auto-complete in material selection fields

### 2.5 Documents (`/documente`)
- [ ] Page loads with tab interface
- [ ] Entry tab displays entry documents
- [ ] Exit tab displays exit documents
- [ ] Add document button opens form
- [ ] Date picker for document date
- [ ] Document number entry
- [ ] Document type selection changes behavior
- [ ] Material search with auto-complete
- [ ] Add line items to document
- [ ] Quantity validation (stock check for exits)
- [ ] Price auto-fills from material
- [ ] Total value calculation
- [ ] Save document
- [ ] Edit existing document
- [ ] Delete document with confirmation
- [ ] Print single document
- [ ] Print multiple documents selection
- [ ] Transfer documents create dual entries

## 3. Reporting System (`/rapoarte`)

### 3.1 Report Selection
- [ ] Report type dropdown works
- [ ] Form changes based on selected report

### 3.2 Analytical Balance (Balanta Analitica)
- [ ] Date range picker works
- [ ] Material type filter
- [ ] Category filter with "All" toggle
- [ ] Location filter with "All" toggle  
- [ ] State filter with "All" toggle
- [ ] Generate report button
- [ ] Report displays with correct calculations
- [ ] Initial stock, entries, exits, final stock columns
- [ ] Export/Print functionality

### 3.3 Inventory List (Lista de Inventariere)
- [ ] Current date snapshot
- [ ] Filters work correctly
- [ ] Generate and display report
- [ ] Print functionality

### 3.4 Material Card (Fisa de Material)
- [ ] Material selection with auto-complete
- [ ] Date range selection
- [ ] Generate individual material history
- [ ] Running balance calculations
- [ ] Transaction details display
- [ ] Print functionality

## 4. Procurement System (PAAP)

### 4.1 PAAP Management (`/paap`)
- [ ] Page loads with year selector
- [ ] Previous/Current/Next year switching
- [ ] Virtual scroll table loads large datasets
- [ ] Inline editing of quantities
- [ ] Inline editing of values
- [ ] CPV code selection dialog
- [ ] Procedure type dropdown
- [ ] Responsible person selection
- [ ] Department assignment
- [ ] Save inline edits
- [ ] Multi-select rows
- [ ] Bulk edit selected items
- [ ] Clone items to next year
- [ ] Delete selected items
- [ ] Filters panel opens/closes
- [ ] Filter by budget article
- [ ] Filter by value range
- [ ] Filter by procedure type
- [ ] Filter by department
- [ ] Combined filters work
- [ ] Permission-based UI (Procurement dept features)

## 5. Budget Commitments (Angajamente)

### 5.1 Commitments List (`/angajamente` in bifalop)
- [ ] Page loads with commitments table
- [ ] Add new commitment button
- [ ] Commitment form validation
- [ ] Budget category selection
- [ ] Available budget calculation
- [ ] Save new commitment
- [ ] Supplement commitment functionality
- [ ] Reduce commitment functionality
- [ ] CFPP visa approval workflow
- [ ] Timeline view for commitment history
- [ ] Print single commitment
- [ ] Print commitments by date range
- [ ] Supervisor mode UI changes

### 5.2 Related Features
- [ ] Suppliers page (`/furnizori`) loads
- [ ] Supplier CRUD operations
- [ ] Liquidations page (`/lichidari`) loads
- [ ] Link liquidations to commitments

## 6. Common UI Components

### 6.1 Navigation
- [ ] Side menu opens/closes
- [ ] Menu items highlight active route
- [ ] Role-based menu items display
- [ ] Mobile responsive menu

### 6.2 Notifications
- [ ] Success notifications (green) appear
- [ ] Error notifications (red) appear
- [ ] Warning notifications appear
- [ ] Notification position (top, bottom, etc.)
- [ ] Auto-dismiss timeout works

### 6.3 Forms
- [ ] All q-input components work
- [ ] All q-select dropdowns work
- [ ] All q-date pickers work
- [ ] Validation messages display
- [ ] Required field indicators
- [ ] Form submit/cancel buttons

### 6.4 Tables
- [ ] Column sorting (click headers)
- [ ] Search/filter inputs
- [ ] Pagination controls
- [ ] Rows per page selector
- [ ] Row selection (checkbox)
- [ ] Dense mode toggle
- [ ] No data message

### 6.5 Dialogs
- [ ] Dialogs open with backdrop
- [ ] Close button/icon works
- [ ] Escape key closes dialog
- [ ] Form validation in dialogs
- [ ] Save action works
- [ ] Cancel action works

## 7. PDF Generation & Printing

### 7.1 Report PDFs
- [ ] Balance sheet PDF generation
- [ ] Inventory list PDF generation
- [ ] Material card PDF generation
- [ ] Document print PDF generation
- [ ] Commitment print PDF generation
- [ ] PDF styling and formatting
- [ ] Company logo appears
- [ ] Multi-page handling
- [ ] Print dialog opens

## 8. API Integration

### 8.1 General API Features
- [ ] Authorization header sent with requests
- [ ] 401 errors redirect to login
- [ ] Network error notifications
- [ ] Loading spinners during requests
- [ ] Successful operations show success message
- [ ] Failed operations show error details

## 9. State Management

### 9.1 User State
- [ ] User info persists after login
- [ ] Selected warehouse persists
- [ ] User preferences maintained
- [ ] State clears on logout

## 10. Performance & Responsiveness

### 10.1 Performance
- [ ] Virtual scroll in large tables
- [ ] No memory leaks on route changes
- [ ] Smooth animations and transitions
- [ ] Fast page load times

### 10.2 Responsive Design
- [ ] Desktop layout (1920px)
- [ ] Laptop layout (1366px)
- [ ] Tablet layout (768px)
- [ ] Mobile layout (375px)
- [ ] Menu adaptation for mobile

## Critical Business Logic Tests

### Financial Calculations
- [ ] Stock quantity calculations are accurate
- [ ] Average price calculations are correct
- [ ] Total value calculations in documents
- [ ] Budget availability calculations
- [ ] Report totals and subtotals

### Data Integrity
- [ ] Document numbers are sequential
- [ ] No duplicate document numbers
- [ ] Referential integrity maintained
- [ ] Cascading deletes work properly
- [ ] Transaction atomicity

### Security
- [ ] Role-based access enforced
- [ ] API calls require authentication
- [ ] Sensitive data not exposed
- [ ] Input sanitization works

## Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Migration-Specific Tests
- [ ] All Vue 2 syntax removed
- [ ] Composition API works correctly
- [ ] Pinia store replaces Vuex
- [ ] Quasar v2 components render
- [ ] No console errors
- [ ] No deprecation warnings

---

**Note**: Check each item after testing. Any failures should be documented with:
- Component/Page affected
- Steps to reproduce
- Expected vs actual behavior
- Error messages (if any)