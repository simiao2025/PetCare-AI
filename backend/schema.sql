-- Tutores (clientes humanos)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL, -- WhatsApp format: 5511999999999
  email VARCHAR(100),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
  gdpr_consent_at TIMESTAMPTZ
);

-- Pets (animais de estimação)
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  species VARCHAR(20) NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'other')),
  breed VARCHAR(50),
  birth_date DATE,
  weight_kg DECIMAL(5,2),
  photo_url VARCHAR(500),
  medical_history JSONB DEFAULT '{}'::jsonb, -- Vacinas, alergias, condições crônicas
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agendamentos
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  professional_id UUID, -- Veterinário/recepcionista
  service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('consultation', 'vaccination', 'bath', 'grooming', 'surgery', 'emergency')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  whatsapp_thread_id VARCHAR(100), -- ID da conversa WA para contexto
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices críticos para performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pets_client_id ON pets(client_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_phone ON clients(phone);
