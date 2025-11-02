#!/bin/bash

# Скрипт для обновления импортов после рефакторинга

echo "🔄 Обновление импортов..."

# Обновить импорты UI компонентов
echo "📦 Обновление импортов UI компонентов..."
find /Users/one.van/Desktop/kanban_ai_agent/kan-front/app -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i '' "s|from '@/components/ui/|from '@/src/shared/components/ui/|g" "$file"
  sed -i '' "s|from '../components/ui/|from '@/src/shared/components/ui/|g" "$file"
  sed -i '' "s|from '../../components/ui/|from '@/src/shared/components/ui/|g" "$file"
done

# Обновить импорты общих компонентов
echo "🎨 Обновление импортов общих компонентов..."
find /Users/one.van/Desktop/kanban_ai_agent/kan-front/app -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  sed -i '' "s|from '@/src/components/theme-provider'|from '@/src/shared/components/common/theme-provider'|g" "$file"
  sed -i '' "s|from '@/src/components/mode-toggle'|from '@/src/shared/components/common/mode-toggle'|g" "$file"
done

# Обновить импорты хуков
echo "🪝 Обновление импортов хуков..."
find /Users/one.van/Desktop/kanban_ai_agent/kan-front/app -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  sed -i '' "s|from '@/src/hooks/|from '@/src/shared/hooks/|g" "$file"
done

# Обновить импорты i18n
echo "🌍 Обновление импортов i18n..."
find /Users/one.van/Desktop/kanban_ai_agent/kan-front/app -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  sed -i '' "s|from '@/src/lib/i18n'|from '@/src/shared/i18n'|g" "$file"
done

# Обновить импорты типов
echo "📝 Обновление импортов типов..."
find /Users/one.van/Desktop/kanban_ai_agent/kan-front/app -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  sed -i '' "s|from '@/src/lib/types'|from '@/src/shared/types'|g" "$file"
done

echo "✅ Импорты обновлены!"
