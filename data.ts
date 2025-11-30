
import { HierarchyNode, ProjectPhase, DomainInfo, Metric, GlossaryTerm, DevOpsGuide } from './types';

export const PLATFORM_HIERARCHY: HierarchyNode = {
  name: "NGO Operations Platform",
  type: "platform",
  description: "Comprehensive EMR/EHR/HIS System",
  children: [
    // =================================================================================================
    // 1. CLINICAL DOMAIN
    // =================================================================================================
    {
      name: "Clinical Domain (CD)",
      type: "domain",
      code: "CD",
      description: "Manages patient care, clinical data, and healthcare delivery workflows.",
      children: [
        // MODULE 1.1: Patient Management
        {
          name: "Patient Management",
          type: "module",
          code: "CD.1.1",
          description: "Registration, demographics, identity management.",
          children: [
            { name: "Patient Registration", type: "component", code: "CD.1.1.1" },
            { name: "Demographics", type: "component", code: "CD.1.1.2" },
            { name: "Identifiers", type: "component", code: "CD.1.1.3" },
            { name: "Address Management", type: "component", code: "CD.1.1.4" },
            { name: "Contact Management", type: "component", code: "CD.1.1.5" },
            { name: "Consent Management", type: "component", code: "CD.1.1.6" },
            { 
              name: "PatientService", 
              type: "service", 
              code: "CD.1.1.S1",
              description: "Core service for patient CRUD and search operations.",
              apiSpecs: [
                {
                  method: 'POST',
                  endpoint: '/api/v1/patients',
                  summary: 'Register a new patient',
                  parameters: [
                    { name: 'firstName', type: 'string', required: true, description: "Patient's first name" },
                    { name: 'lastName', type: 'string', required: true, description: "Patient's last name" },
                    { name: 'dob', type: 'date', required: true, description: "Date of Birth (YYYY-MM-DD)" },
                    { name: 'gender', type: 'enum', required: true, description: "M, F, O" }
                  ],
                  response: 'Patient'
                },
                {
                  method: 'GET',
                  endpoint: '/api/v1/patients/:id',
                  summary: 'Get patient details by ID',
                  parameters: [{ name: 'id', type: 'uuid', required: true }],
                  response: 'Patient'
                },
                {
                  method: 'PUT',
                  endpoint: '/api/v1/patients/:id',
                  summary: 'Update patient demographics',
                  parameters: [
                      { name: 'id', type: 'uuid', required: true },
                      { name: 'data', type: 'Partial<Patient>', required: true }
                  ],
                  response: 'Patient'
                },
                {
                  method: 'POST',
                  endpoint: '/api/v1/patients/search',
                  summary: 'Search patients by name or identifier',
                  parameters: [{ name: 'query', type: 'string', required: true }],
                  response: 'List<Patient>'
                }
              ]
            },
            {
              name: "IdentifierService",
              type: "service",
              code: "CD.1.1.S2",
              apiSpecs: [
                 { method: 'POST', endpoint: '/api/v1/identifiers/generate', summary: 'Generate new unique ID', response: '{ identifier: "string" }' },
                 { method: 'POST', endpoint: '/api/v1/identifiers/validate', summary: 'Validate format', parameters: [{name: 'id', type: 'string', required: true}], response: '{ valid: boolean }' }
              ]
            },
            { 
                name: "patients", 
                type: "data",
                code: "CD.1.1.D1",
                dataSchema: {
                  tableName: "patients",
                  description: "Core patient demographic records",
                  columns: [
                    { name: "id", type: "UUID", constraints: ["PK", "NOT NULL"] },
                    { name: "first_name", type: "VARCHAR(100)", constraints: ["NOT NULL"] },
                    { name: "last_name", type: "VARCHAR(100)", constraints: ["NOT NULL"] },
                    { name: "date_of_birth", type: "DATE", constraints: ["NOT NULL"] },
                    { name: "gender", type: "ENUM", constraints: ["NOT NULL"] },
                    { name: "created_at", type: "TIMESTAMP", constraints: ["DEFAULT NOW()"] },
                    { name: "deleted_at", type: "TIMESTAMP", constraints: ["NULLABLE"] }
                  ]
                }
            },
            {
                name: "patient_identifiers",
                type: "data",
                code: "CD.1.1.D2",
                dataSchema: {
                    tableName: "patient_identifiers",
                    columns: [
                        { name: "id", type: "UUID", constraints: ["PK"] },
                        { name: "patient_id", type: "UUID", constraints: ["FK(patients.id)"] },
                        { name: "identifier_type", type: "VARCHAR(50)", constraints: ["NOT NULL"] },
                        { name: "identifier_value", type: "VARCHAR(50)", constraints: ["NOT NULL", "UNIQUE"] }
                    ]
                }
            },
            {
                name: "patient_addresses",
                type: "data",
                code: "CD.1.1.D3",
                dataSchema: {
                    tableName: "patient_addresses",
                    columns: [
                        { name: "id", type: "UUID", constraints: ["PK"] },
                        { name: "patient_id", type: "UUID", constraints: ["FK(patients.id)"] },
                        { name: "address_line", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
                        { name: "city", type: "VARCHAR(100)", constraints: ["NOT NULL"] },
                        { name: "country", type: "VARCHAR(100)", constraints: ["NOT NULL"] },
                        { name: "is_primary", type: "BOOLEAN", constraints: ["DEFAULT FALSE"] }
                    ]
                }
            }
          ]
        },
        // MODULE 1.2: Encounter Management
        {
          name: "Encounter Management",
          type: "module",
          code: "CD.1.2",
          description: "Visits, workflows, and provider interactions.",
          dependencies: ["CD.1.1"],
          children: [
            { name: "Encounter Creation", type: "component", code: "CD.1.2.1" },
            { name: "Encounter Types", type: "component", code: "CD.1.2.2" },
            { name: "Locations", type: "component", code: "CD.1.2.3" },
            { name: "Provider Assignment", type: "component", code: "CD.1.2.4" },
            { name: "Workflows", type: "component", code: "CD.1.2.5" },
            { 
              name: "EncounterService", 
              type: "service",
              code: "CD.1.2.S1",
              apiSpecs: [
                  { 
                      method: 'POST', 
                      endpoint: '/api/v1/encounters', 
                      summary: 'Start new encounter', 
                      parameters: [
                          { name: 'patientId', type: 'uuid', required: true },
                          { name: 'typeId', type: 'uuid', required: true },
                          { name: 'locationId', type: 'uuid', required: true }
                      ],
                      response: 'Encounter' 
                  },
                  { method: 'PUT', endpoint: '/api/v1/encounters/:id/end', summary: 'End encounter', response: 'Encounter' },
                  { method: 'GET', endpoint: '/api/v1/encounters/active', summary: 'List active encounters', response: 'List<Encounter>' }
              ]
            },
            { 
              name: "LocationService", 
              type: "service",
              code: "CD.1.2.S2",
              apiSpecs: [
                  { method: 'GET', endpoint: '/api/v1/locations', summary: 'List facility locations', response: 'List<Location>' }
              ]
            },
            { 
                name: "encounters", 
                type: "data",
                code: "CD.1.2.D1",
                dataSchema: {
                    tableName: "encounters",
                    columns: [
                        { name: "id", type: "UUID", constraints: ["PK"] },
                        { name: "patient_id", type: "UUID", constraints: ["FK"] },
                        { name: "provider_id", type: "UUID", constraints: ["FK"] },
                        { name: "location_id", type: "UUID", constraints: ["FK"] },
                        { name: "type_id", type: "UUID", constraints: ["FK"] },
                        { name: "start_time", type: "TIMESTAMP", constraints: ["NOT NULL"] },
                        { name: "end_time", type: "TIMESTAMP", constraints: ["NULLABLE"] },
                        { name: "status", type: "VARCHAR(20)", constraints: ["NOT NULL"] }
                    ]
                }
            }
          ]
        },
        // MODULE 1.3: Clinical Data
        {
          name: "Clinical Data",
          type: "module",
          code: "CD.1.3",
          description: "Observations, vitals, labs, diagnosis.",
          dependencies: ["CD.1.2"],
          children: [
             { name: "Observations", type: "component", code: "CD.1.3.1" },
             { name: "Vital Signs", type: "component", code: "CD.1.3.2" },
             { name: "Lab Results", type: "component", code: "CD.1.3.3" },
             { name: "Diagnoses", type: "component", code: "CD.1.3.4" },
             { name: "Procedures", type: "component", code: "CD.1.3.5" },
             { 
                 name: "ObservationService", 
                 type: "service",
                 code: "CD.1.3.S1",
                 apiSpecs: [
                     { 
                         method: 'POST', 
                         endpoint: '/api/v1/observations', 
                         summary: 'Record clinical observation', 
                         parameters: [
                             { name: 'encounterId', type: 'uuid', required: true },
                             { name: 'conceptId', type: 'uuid', required: true },
                             { name: 'value', type: 'any', required: true }
                         ],
                         response: 'Observation' 
                     },
                     { method: 'GET', endpoint: '/api/v1/encounters/:id/obs', summary: 'Get observations for encounter', response: 'List<Observation>' }
                 ]
             },
             { 
                 name: "ConceptService", 
                 type: "service",
                 code: "CD.1.3.S2",
                 apiSpecs: [
                     { method: 'GET', endpoint: '/api/v1/concepts/search', summary: 'Search clinical concepts', response: 'List<Concept>' }
                 ]
             },
             {
                 name: "observations",
                 type: "data",
                 code: "CD.1.3.D1",
                 dataSchema: {
                     tableName: "observations",
                     columns: [
                         { name: "id", type: "UUID", constraints: ["PK"] },
                         { name: "encounter_id", type: "UUID", constraints: ["FK"] },
                         { name: "concept_id", type: "UUID", constraints: ["FK(concepts)"] },
                         { name: "value_numeric", type: "DECIMAL", constraints: ["NULLABLE"] },
                         { name: "value_text", type: "TEXT", constraints: ["NULLABLE"] },
                         { name: "obs_datetime", type: "TIMESTAMP", constraints: ["NOT NULL"] }
                     ]
                 }
             },
             {
                 name: "concepts",
                 type: "data",
                 code: "CD.1.3.D2",
                 dataSchema: {
                     tableName: "concepts",
                     columns: [
                         { name: "id", type: "UUID", constraints: ["PK"] },
                         { name: "code", type: "VARCHAR(50)", constraints: ["UNIQUE", "NOT NULL"] },
                         { name: "name", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
                         { name: "datatype", type: "VARCHAR(20)", constraints: ["NOT NULL"] },
                         { name: "class", type: "VARCHAR(50)", constraints: ["NOT NULL"] }
                     ]
                 }
             }
          ]
        },
        // MODULE 1.4: Medication Management
        {
            name: "Medication Management",
            type: "module",
            code: "CD.1.4",
            description: "Orders, prescriptions, dispensing.",
            dependencies: ["CD.1.1", "CD.1.2"],
            children: [
                { name: "Catalog", type: "component", code: "CD.1.4.1" },
                { name: "Prescribing", type: "component", code: "CD.1.4.2" },
                { name: "Dispensing", type: "component", code: "CD.1.4.3" },
                { 
                    name: "MedicationService", 
                    type: "service",
                    code: "CD.1.4.S1",
                    apiSpecs: [
                        { method: 'POST', endpoint: '/api/v1/orders/medication', summary: 'Create medication order', response: 'Order' },
                        { method: 'GET', endpoint: '/api/v1/medications', summary: 'List available medications', response: 'List<Medication>' }
                    ]
                },
                {
                    name: "medications",
                    type: "data",
                    code: "CD.1.4.D1",
                    dataSchema: {
                        tableName: "medications",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "name", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
                            { name: "form", type: "VARCHAR(50)", constraints: ["NOT NULL"] },
                            { name: "strength", type: "VARCHAR(50)", constraints: ["NOT NULL"] }
                        ]
                    }
                },
                {
                    name: "medication_orders",
                    type: "data",
                    code: "CD.1.4.D2",
                    dataSchema: {
                        tableName: "medication_orders",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "encounter_id", type: "UUID", constraints: ["FK"] },
                            { name: "medication_id", type: "UUID", constraints: ["FK"] },
                            { name: "dosage", type: "VARCHAR", constraints: ["NOT NULL"] },
                            { name: "frequency", type: "VARCHAR", constraints: ["NOT NULL"] },
                            { name: "duration_days", type: "INT", constraints: ["NOT NULL"] }
                        ]
                    }
                }
            ]
        }
      ]
    },

    // =================================================================================================
    // 2. OPERATIONAL DOMAIN
    // =================================================================================================
    {
      name: "Operational Domain (OD)",
      type: "domain",
      code: "OD",
      description: "Facility operations, inventory, billing, HR.",
      children: [
        // MODULE 2.1: Inventory Management
        {
          name: "Inventory Management",
          type: "module",
          code: "OD.2.1",
          description: "Stock levels, expiry tracking, procurement.",
          children: [
              { name: "Stock Management", type: "component", code: "OD.2.1.1" },
              { name: "Stock Adjustments", type: "component", code: "OD.2.1.2" },
              { name: "Expiry Tracking", type: "component", code: "OD.2.1.3" },
              { name: "Procurement", type: "component", code: "OD.2.1.4" },
              { 
                  name: "InventoryService", 
                  type: "service",
                  code: "OD.2.1.S1",
                  apiSpecs: [
                      { method: 'GET', endpoint: '/api/v1/inventory/:itemId', summary: 'Get stock level', response: '{ quantity: number }' },
                      { method: 'POST', endpoint: '/api/v1/inventory/adjust', summary: 'Adjust stock', response: 'AdjustmentRecord' },
                      { method: 'GET', endpoint: '/api/v1/inventory/expiring', summary: 'Get expiring items', response: 'List<InventoryItem>' }
                  ]
              },
              {
                  name: "inventory",
                  type: "data",
                  code: "OD.2.1.D1",
                  dataSchema: {
                      tableName: "inventory",
                      columns: [
                          { name: "id", type: "UUID", constraints: ["PK"] },
                          { name: "item_name", type: "VARCHAR", constraints: ["NOT NULL"] },
                          { name: "quantity", type: "INTEGER", constraints: ["NOT NULL"] },
                          { name: "expiry_date", type: "DATE", constraints: ["NOT NULL"] },
                          { name: "batch_no", type: "VARCHAR", constraints: ["NOT NULL"] }
                      ]
                  }
              }
          ]
        },
        // MODULE 2.2: Pharmacy Management
        {
            name: "Pharmacy Management",
            type: "module",
            code: "OD.2.2",
            description: "Dispensing workflow, pharmacy inventory.",
            dependencies: ["CD.1.4", "OD.2.1"],
            children: [
                { name: "Dispensing", type: "component", code: "OD.2.2.1" },
                { 
                    name: "PharmacyService", 
                    type: "service",
                    code: "OD.2.2.S1",
                    apiSpecs: [
                        { method: 'POST', endpoint: '/api/v1/pharmacy/dispense', summary: 'Dispense medication', response: 'DispenseRecord' }
                    ]
                },
                {
                    name: "pharmacy_inventory",
                    type: "data",
                    code: "OD.2.2.D1",
                    dataSchema: {
                        tableName: "pharmacy_inventory",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "medication_id", type: "UUID", constraints: ["FK"] },
                            { name: "quantity", type: "INT", constraints: ["NOT NULL"] },
                            { name: "batch_number", type: "VARCHAR", constraints: ["NOT NULL"] },
                            { name: "expiry_date", type: "DATE", constraints: ["NOT NULL"] }
                        ]
                    }
                }
            ]
        },
        // MODULE 2.3: Billing & Finance
        {
            name: "Billing & Finance",
            type: "module",
            code: "OD.2.3",
            description: "Invoicing, payments, revenue tracking.",
            dependencies: ["CD.1.2"],
            children: [
                { name: "Bill Creation", type: "component", code: "OD.2.3.1" },
                { name: "Invoicing", type: "component", code: "OD.2.3.2" },
                { name: "Payment Recording", type: "component", code: "OD.2.3.3" },
                { 
                    name: "BillingService", 
                    type: "service",
                    code: "OD.2.3.S1",
                    apiSpecs: [
                        { method: 'POST', endpoint: '/api/v1/billing/create', summary: 'Generate bill for encounter', response: 'Bill' },
                        { method: 'GET', endpoint: '/api/v1/billing/:id', summary: 'Get bill details', response: 'Bill' },
                        { method: 'POST', endpoint: '/api/v1/billing/pay', summary: 'Record payment', response: 'Receipt' }
                    ]
                },
                {
                    name: "bills",
                    type: "data",
                    code: "OD.2.3.D1",
                    dataSchema: {
                        tableName: "bills",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "patient_id", type: "UUID", constraints: ["FK"] },
                            { name: "encounter_id", type: "UUID", constraints: ["FK"] },
                            { name: "amount_total", type: "DECIMAL", constraints: ["NOT NULL"] },
                            { name: "status", type: "VARCHAR", constraints: ["NOT NULL"] }
                        ]
                    }
                }
            ]
        },
        // MODULE 2.4: HR Management
        {
            name: "HR Management",
            type: "module",
            code: "OD.2.4",
            description: "Employee records, scheduling, payroll.",
            children: [
                { name: "Employee Management", type: "component", code: "OD.2.4.1" },
                { name: "Scheduling", type: "component", code: "OD.2.4.2" },
                { 
                    name: "HRService", 
                    type: "service",
                    code: "OD.2.4.S1",
                    apiSpecs: [
                        { method: 'GET', endpoint: '/api/v1/hr/employees', summary: 'List employees', response: 'List<Employee>' },
                        { method: 'POST', endpoint: '/api/v1/hr/schedule', summary: 'Create schedule', response: 'Schedule' }
                    ]
                },
                {
                    name: "employees",
                    type: "data",
                    code: "OD.2.4.D1",
                    dataSchema: {
                        tableName: "employees",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "user_id", type: "UUID", constraints: ["FK(users)"] },
                            { name: "department", type: "VARCHAR(100)", constraints: ["NULLABLE"] },
                            { name: "role", type: "VARCHAR(50)", constraints: ["NOT NULL"] }
                        ]
                    }
                }
            ]
        }
      ]
    },

    // =================================================================================================
    // 3. ANALYTICS DOMAIN
    // =================================================================================================
    {
      name: "Analytics Domain (AD)",
      type: "domain",
      code: "AD",
      description: "Reporting, Dashboards, KPIs, Data Warehouse.",
      children: [
        // MODULE 3.1: Dashboard
        { 
            name: "Dashboard", 
            type: "module", 
            code: "AD.3.1", 
            description: "Real-time visualizations.",
            dependencies: ["CD.1.1", "CD.1.2", "OD.2.3"],
            children: [
                { name: "Widget Engine", type: "component", code: "AD.3.1.1" },
                { name: "Patient Dashboard", type: "component", code: "AD.3.1.2" },
                { 
                    name: "DashboardService", 
                    type: "service",
                    code: "AD.3.1.S1",
                    apiSpecs: [
                        { method: 'GET', endpoint: '/api/v1/dashboard/metrics', summary: 'Get aggregated metrics', response: 'Metrics' }
                    ]
                },
                {
                    name: "dashboards",
                    type: "data",
                    code: "AD.3.1.D1",
                    dataSchema: {
                        tableName: "dashboards",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "name", type: "VARCHAR(100)", constraints: ["NOT NULL"] },
                            { name: "owner_id", type: "UUID", constraints: ["FK(users)"] },
                            { name: "config", type: "JSONB", constraints: ["NULLABLE"] }
                        ]
                    }
                }
            ]
        },
        // MODULE 3.2: Reporting
        { 
            name: "Reporting", 
            type: "module", 
            code: "AD.3.2",
            description: "Custom report builder and templates.",
            children: [
                { name: "Report Builder", type: "component", code: "AD.3.2.1" },
                { name: "Scheduled Reports", type: "component", code: "AD.3.2.2" },
                { 
                    name: "ReportService", 
                    type: "service", 
                    code: "AD.3.2.S1",
                    apiSpecs: [
                        { method: 'POST', endpoint: '/api/v1/reports/generate', summary: 'Run report', response: 'ReportResult' }
                    ]
                },
                {
                    name: "reports",
                    type: "data",
                    code: "AD.3.2.D1",
                    dataSchema: {
                        tableName: "reports",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "name", type: "VARCHAR(100)", constraints: ["NOT NULL"] },
                            { name: "template_id", type: "UUID", constraints: ["FK"] },
                            { name: "generated_at", type: "TIMESTAMP", constraints: ["DEFAULT NOW()"] },
                            { name: "file_path", type: "VARCHAR(255)", constraints: ["NULLABLE"] }
                        ]
                    }
                }
            ]
        },
        // MODULE 3.3: KPI
        { 
            name: "KPI Module", 
            type: "module", 
            code: "AD.3.3",
            description: "Key Performance Indicator tracking.",
            children: [
                { name: "KPI Definition", type: "component", code: "AD.3.3.1" },
                { name: "KPI Calculation", type: "component", code: "AD.3.3.2" },
                { name: "KPIService", type: "service", code: "AD.3.3.S1" },
                {
                    name: "kpis",
                    type: "data",
                    code: "AD.3.3.D1",
                    dataSchema: {
                        tableName: "kpis",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "name", type: "VARCHAR(100)", constraints: ["NOT NULL"] },
                            { name: "target", type: "DECIMAL", constraints: ["NULLABLE"] },
                            { name: "calculation_method", type: "VARCHAR(50)", constraints: ["NOT NULL"] }
                        ]
                    }
                }
            ]
        },
        // MODULE 3.4: Data Warehouse
        { 
            name: "Data Warehouse", 
            type: "module", 
            code: "AD.3.4",
            description: "Aggregated data for OLAP.",
            children: [
                { name: "Fact Tables", type: "component", code: "AD.3.4.1" },
                { name: "Dimension Tables", type: "component", code: "AD.3.4.2" },
                { 
                    name: "fact_encounters", 
                    type: "data",
                    code: "AD.3.4.D1",
                    dataSchema: {
                        tableName: "fact_encounters",
                        columns: [
                            { name: "time_key", type: "INT", constraints: ["FK"] },
                            { name: "location_key", type: "INT", constraints: ["FK"] },
                            { name: "patient_count", type: "INT", constraints: ["NOT NULL"] },
                            { name: "avg_duration_minutes", type: "DECIMAL", constraints: ["NULLABLE"] }
                        ]
                    }
                }
            ]
        }
      ]
    },

    // =================================================================================================
    // 4. INTEGRATION DOMAIN
    // =================================================================================================
    {
      name: "Integration Domain (ID)",
      type: "domain",
      code: "ID",
      description: "External systems, standards compliance.",
      children: [
        // MODULE 4.1: OpenMRS Integration
        { 
            name: "OpenMRS Integration", 
            type: "module", 
            code: "ID.4.1", 
            description: "Sync clinical data with OpenMRS.",
            dependencies: ["CD.1.1", "CD.1.2"],
            children: [
                { name: "Patient Sync", type: "component", code: "ID.4.1.1" },
                { name: "Encounter Sync", type: "component", code: "ID.4.1.2" },
                { 
                    name: "OpenMRSService", 
                    type: "service", 
                    code: "ID.4.1.S1",
                    apiSpecs: [
                        { method: 'POST', endpoint: '/api/v1/openmrs/sync', summary: 'Trigger manual sync', response: '{ status: "started" }' }
                    ]
                },
                {
                    name: "sync_logs",
                    type: "data",
                    code: "ID.4.1.D1",
                    dataSchema: {
                        tableName: "sync_logs",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "system", type: "VARCHAR(20)", constraints: ["NOT NULL"] },
                            { name: "status", type: "VARCHAR(20)", constraints: ["NOT NULL"] },
                            { name: "message", type: "TEXT", constraints: ["NULLABLE"] },
                            { name: "timestamp", type: "TIMESTAMP", constraints: ["DEFAULT NOW()"] }
                        ]
                    }
                }
            ]
        },
        // MODULE 4.2: Odoo Integration
        { 
            name: "Odoo Integration", 
            type: "module", 
            code: "ID.4.2", 
            description: "ERP sync for inventory/finance.",
            dependencies: ["OD.2.1", "OD.2.3"],
            children: [
                { name: "Accounting Sync", type: "component", code: "ID.4.2.1" },
                { name: "OdooService", type: "service", code: "ID.4.2.S1" }
            ]
        },
        // MODULE 4.3: DHIS2 Integration
        { 
            name: "DHIS2 Integration", 
            type: "module", 
            code: "ID.4.3",
            description: "National health reporting export.",
            children: [
                { name: "Data Mapping", type: "component", code: "ID.4.3.1" },
                { name: "DHIS2Service", type: "service", code: "ID.4.3.S1" }
            ]
        },
        // MODULE 4.4: FHIR Compliance
        { 
            name: "FHIR Compliance", 
            type: "module", 
            code: "ID.4.4",
            description: "FHIR resource mapping and validation.",
            children: [
                { name: "FHIR Resources", type: "component", code: "ID.4.4.1" },
                { 
                    name: "FHIRService", 
                    type: "service", 
                    code: "ID.4.4.S1",
                    apiSpecs: [
                        { method: 'GET', endpoint: '/api/fhir/Patient/:id', summary: 'Get FHIR Patient Resource', response: 'FHIRPatient' },
                        { method: 'POST', endpoint: '/api/fhir/Bundle', summary: 'Process FHIR Bundle', response: 'BundleResponse' }
                    ]
                }
            ]
        },
        // MODULE 4.5: HL7 Support
        { 
            name: "HL7 Support", 
            type: "module", 
            code: "ID.4.5",
            description: "HL7 v2/v3 message parsing.",
            children: [
                { name: "HL7 Parsing", type: "component", code: "ID.4.5.1" },
                { name: "HL7Service", type: "service", code: "ID.4.5.S1" }
            ]
        }
      ]
    },

    // =================================================================================================
    // 5. INFRASTRUCTURE DOMAIN
    // =================================================================================================
    {
      name: "Infrastructure Domain (IF)",
      type: "domain",
      code: "IF",
      description: "Security, logging, core services.",
      children: [
        // MODULE 5.1: Authentication
        { 
            name: "Authentication", 
            type: "module", 
            code: "IF.5.1",
            description: "Login, JWT, Session management.",
            children: [
                { name: "Login Component", type: "component", code: "IF.5.1.1" },
                { 
                    name: "AuthService", 
                    type: "service", 
                    code: "IF.5.1.S1",
                    apiSpecs: [
                        { method: 'POST', endpoint: '/auth/login', summary: 'Authenticate user', response: '{ token: "jwt" }' },
                        { method: 'POST', endpoint: '/auth/refresh', summary: 'Refresh token', response: '{ token: "jwt" }' },
                        { method: 'POST', endpoint: '/auth/logout', summary: 'Invalidate session', response: '{ status: "ok" }' }
                    ]
                },
                {
                    name: "users",
                    type: "data",
                    code: "IF.5.1.D1",
                    dataSchema: {
                        tableName: "users",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "username", type: "VARCHAR(50)", constraints: ["UNIQUE", "NOT NULL"] },
                            { name: "password_hash", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
                            { name: "email", type: "VARCHAR(100)", constraints: ["NULLABLE"] },
                            { name: "status", type: "VARCHAR(20)", constraints: ["DEFAULT 'ACTIVE'"] }
                        ]
                    }
                }
            ]
        }, 
        // MODULE 5.2: Authorization
        { 
            name: "Authorization", 
            type: "module", 
            code: "IF.5.2", 
            description: "RBAC, ABAC, Permissions.",
            dependencies: ["IF.5.1"],
            children: [
                { name: "Role Management", type: "component", code: "IF.5.2.1" },
                {
                    name: "roles",
                    type: "data",
                    code: "IF.5.2.D1",
                    dataSchema: {
                        tableName: "roles",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "name", type: "VARCHAR(50)", constraints: ["UNIQUE", "NOT NULL"] },
                            { name: "description", type: "TEXT", constraints: ["NULLABLE"] }
                        ]
                    }
                }
            ]
        },
        // MODULE 5.3: Audit
        { 
            name: "Audit", 
            type: "module", 
            code: "IF.5.3",
            description: "System-wide action logging.",
            children: [
                { name: "Action Logging", type: "component", code: "IF.5.3.1" },
                { name: "AuditService", type: "service", code: "IF.5.3.S1" },
                { 
                    name: "audit_logs", 
                    type: "data", 
                    code: "IF.5.3.D1",
                    dataSchema: {
                        tableName: "audit_logs",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "user_id", type: "UUID", constraints: ["FK"] },
                            { name: "action", type: "VARCHAR", constraints: ["NOT NULL"] },
                            { name: "resource", type: "VARCHAR", constraints: ["NULLABLE"] },
                            { name: "timestamp", type: "TIMESTAMP", constraints: ["NOT NULL"] }
                        ]
                    }
                }
            ]
        },
        // MODULE 5.4: Notification
        { 
            name: "Notification", 
            type: "module", 
            code: "IF.5.4",
            children: [
                { name: "Notification Engine", type: "component", code: "IF.5.4.1" },
                { name: "NotificationService", type: "service", code: "IF.5.4.S1" },
                {
                    name: "notifications",
                    type: "data",
                    code: "IF.5.4.D1",
                    dataSchema: {
                        tableName: "notifications",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "user_id", type: "UUID", constraints: ["FK"] },
                            { name: "type", type: "VARCHAR(20)", constraints: ["NOT NULL"] },
                            { name: "message", type: "TEXT", constraints: ["NOT NULL"] },
                            { name: "read_at", type: "TIMESTAMP", constraints: ["NULLABLE"] }
                        ]
                    }
                }
            ]
        },
        // MODULE 5.5: File Storage
        { 
            name: "File Storage", 
            type: "module", 
            code: "IF.5.5",
            children: [
                { name: "File Upload", type: "component", code: "IF.5.5.1" },
                {
                    name: "files",
                    type: "data",
                    code: "IF.5.5.D1",
                    dataSchema: {
                        tableName: "files",
                        columns: [
                            { name: "id", type: "UUID", constraints: ["PK"] },
                            { name: "entity_type", type: "VARCHAR(50)", constraints: ["NOT NULL"] },
                            { name: "entity_id", type: "UUID", constraints: ["NOT NULL"] },
                            { name: "file_path", type: "VARCHAR(255)", constraints: ["NOT NULL"] },
                            { name: "mime_type", type: "VARCHAR(50)", constraints: ["NOT NULL"] }
                        ]
                    }
                }
            ]
        },
        { name: "Caching", type: "module", code: "IF.5.6" },
        { name: "Search", type: "module", code: "IF.5.7" }
      ]
    }
  ]
};

export const PROJECT_PHASES: ProjectPhase[] = [
  {
    id: 1,
    name: "Foundation",
    startWeek: 1,
    endWeek: 4,
    budget: 150000,
    status: "Planning",
    description: "Environment setup, DB schema, Auth, Infrastructure.",
    deliverables: ["Docker/K8s Setup", "DB Schema (50+ tables)", "Auth System", "API Gateway"]
  },
  {
    id: 2,
    name: "Core Modules",
    startWeek: 5,
    endWeek: 12,
    budget: 250000,
    status: "Not Started",
    description: "Patient, Encounter, Clinical Data, Medication.",
    deliverables: ["PatientService", "EncounterService", "ObservationService", "MedicationService"]
  },
  {
    id: 3,
    name: "Operational",
    startWeek: 13,
    endWeek: 20,
    budget: 200000,
    status: "Not Started",
    description: "Inventory, Pharmacy, Billing, HR.",
    deliverables: ["InventoryService", "PharmacyService", "BillingService", "HRService"]
  },
  {
    id: 4,
    name: "Analytics & Integration",
    startWeek: 21,
    endWeek: 28,
    budget: 250000,
    status: "Not Started",
    description: "Dashboard, Reports, OpenMRS/DHIS2 Sync.",
    deliverables: ["DashboardService", "Data Warehouse", "OpenMRS Sync", "FHIR API"]
  },
  {
    id: 5,
    name: "Deployment",
    startWeek: 29,
    endWeek: 32,
    budget: 150000,
    status: "Not Started",
    description: "QA, UAT, Training, Go-Live.",
    deliverables: ["System Test Report", "User Training", "Production Deployment", "Go-Live"]
  }
];

export const KEY_METRICS: Metric[] = [
  { label: "Total Budget", value: "$1,000,000", icon: "DollarSign" },
  { label: "Duration", value: "32 Weeks", icon: "Clock" },
  { label: "Modules", value: "24", icon: "Grid" },
  { label: "Services", value: "40+", icon: "Server" },
  { label: "API Endpoints", value: "100+", icon: "Network" },
  { label: "DB Tables", value: "50+", icon: "Database" },
];

export const DOMAINS: DomainInfo[] = [
  { id: "CD", name: "Clinical", description: "Patient care & clinical ops", modules: 4, color: "bg-blue-500" },
  { id: "OD", name: "Operational", description: "Facility operations & admin", modules: 4, color: "bg-emerald-500" },
  { id: "AD", name: "Analytics", description: "Reporting & business intel", modules: 4, color: "bg-purple-500" },
  { id: "ID", name: "Integration", description: "External connectivity", modules: 5, color: "bg-orange-500" },
  { id: "IF", name: "Infrastructure", description: "Core system services", modules: 7, color: "bg-slate-500" },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: "Platform", definition: "A comprehensive, production-ready Electronic Medical Record (EMR), Electronic Health Record (EHR), and Health Information System (HIS) framework.", category: "Hierarchy", hierarchy: "Level 1" },
  { term: "Domain", definition: "A major functional area of the system (Clinical, Operational, Analytics, Integration, Infrastructure).", category: "Hierarchy", hierarchy: "Level 2" },
  { term: "Module", definition: "A distinct functional unit within a domain (e.g., Patient Management, Billing).", category: "Hierarchy", hierarchy: "Level 3" },
  { term: "Service", definition: "A distinct business logic unit exposing API methods (e.g., PatientService).", category: "Hierarchy", hierarchy: "Level 5" },
  
  { term: "Patient", definition: "An individual receiving healthcare services.", category: "Healthcare" },
  { term: "Encounter", definition: "A clinical interaction between a patient and healthcare provider.", category: "Healthcare", related: ["Patient", "Provider"] },
  { term: "Observation", definition: "A clinical measurement or finding recorded during an encounter (e.g., Temperature, BP).", category: "Healthcare", related: ["Encounter", "Concept"] },
  { term: "Concept", definition: "A standardized clinical term or measurement (e.g., SNOMED/LOINC code).", category: "Healthcare" },
  { term: "Medication Order", definition: "A prescription for medication to be dispensed to a patient.", category: "Healthcare" },
  
  { term: "FHIR", definition: "Fast Healthcare Interoperability Resources - A standard for exchanging healthcare information.", category: "Integration" },
  { term: "HL7", definition: "Health Level 7 - A set of international standards for transfer of clinical and administrative data.", category: "Integration" },
  { term: "OpenMRS", definition: "Open Medical Record System - An open-source EMR platform the system integrates with.", category: "Integration" },
  { term: "DHIS2", definition: "District Health Information System 2 - Used for aggregate reporting.", category: "Integration" },
  
  { term: "tRPC", definition: "TypeScript Remote Procedure Call - Used for type-safe client-server communication.", category: "Technical" },
  { term: "Drizzle ORM", definition: "TypeScript ORM for interacting with the PostgreSQL database.", category: "Technical" },
  { term: "Tailwind CSS", definition: "Utility-first CSS framework used for frontend styling.", category: "Technical" },
  
  { term: "RBAC", definition: "Role-Based Access Control - Restricting system access to authorized users.", category: "Security" },
  { term: "JWT", definition: "JSON Web Token - Used for secure transmission of information between parties.", category: "Security" },
  { term: "Audit Log", definition: "A chronological record of system activities to enable reconstruction and examination.", category: "Security" }
];

export const DEVOPS_GUIDES: DevOpsGuide[] = [
  {
    id: "local",
    title: "Local Machine Setup",
    icon: "Monitor",
    description: "Get the project running on your own computer for development.",
    steps: [
      {
        title: "Install Prerequisites",
        description: "You need Node.js and Git installed.",
        command: "node -v && git --version",
        tip: "Download Node.js (LTS version) from nodejs.org if the command fails."
      },
      {
        title: "Clone Repository",
        description: "Download the code to your machine.",
        command: "git clone https://github.com/your-org/ngo-platform.git\ncd ngo-platform"
      },
      {
        title: "Install Dependencies",
        description: "Download all the libraries the project needs.",
        command: "npm install",
        tip: "This might take a few minutes."
      },
      {
        title: "Start Development Server",
        description: "Launch the app locally.",
        command: "npm start",
        tip: "The app should open at http://localhost:3000"
      }
    ]
  },
  {
    id: "github",
    title: "GitHub & Pages",
    icon: "Github",
    description: "Version control and free hosting with GitHub Pages.",
    steps: [
      {
        title: "Create Repository",
        description: "Go to github.com/new and create a public repository.",
        tip: "Don't initialize with README if you already have local code."
      },
      {
        title: "Push Code",
        description: "Connect your local code to GitHub.",
        command: "git remote add origin https://github.com/user/repo.git\ngit branch -M main\ngit push -u origin main"
      },
      {
        title: "Configure Pages",
        description: "Add the 'homepage' field to your package.json file.",
        command: '"homepage": "https://<username>.github.io/<repo-name>"'
      },
      {
        title: "Deploy",
        description: "Install gh-pages package and deploy.",
        command: "npm install gh-pages --save-dev\nnpm run deploy",
        tip: "Add 'deploy': 'gh-pages -d build' to scripts in package.json first."
      }
    ]
  },
  {
    id: "vercel",
    title: "Vercel Deployment",
    icon: "Cloud",
    description: "Easiest way to deploy React apps with automatic CI/CD.",
    steps: [
      {
        title: "Sign Up",
        description: "Go to vercel.com and sign up with your GitHub account.",
        tip: "It's free for hobby projects."
      },
      {
        title: "Import Project",
        description: "Click 'Add New Project' and select your GitHub repository.",
        image: "vercel-import"
      },
      {
        title: "Configure Build",
        description: "Vercel usually detects Create React App automatically.",
        tip: "Framework Preset: Create React App\nBuild Command: npm run build\nOutput Directory: build"
      },
      {
        title: "Deploy",
        description: "Click Deploy. Vercel will build your site and give you a live URL.",
        tip: "Every time you git push, Vercel will update your site automatically!"
      }
    ]
  }
];
