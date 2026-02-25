# Рефакторинг админ-страниц

Сценарий рефакторинга — последовательность шагов. Эталон: страница **managers**.

---

## Резюме: правки managers

**Структура:**

- `api/index.ts` — `managersApi` (getManagers, createManager, deleteManager, updateManager)
- `model/useManagers.ts` — хук: managers, isLoading, addManager, deleteManager, isModalOpen, openModal, closeModal
- `model/types.ts` — CreateManagersColumnsParams, PermissionField
- `ui/AddManagerModal.tsx` — форма в `ClosableModal`, props: `onAddManager(values) => Promise<void>` (логика в хуке)
- `ui/RemoveManagerCell.tsx` — кнопка удаления, props: `onDelete(id, name) => Promise<void>`, отвечает за loading
- `helpers.tsx` — `createManagersColumns(params)` — колонки + PermissionSwitch + RemoveManagerCell

**Паттерны:**

- Логика создания/удаления — в `useManagers`, компоненты только вызывают callbacks
- Страница: `useManagers()` + `Table` compound + `AddManagerModal` + `createManagersColumns`
- Локальные стили страницы не требуются — используется `Table` из `@/shared/ui/Table`

---

## Сценарий (шаги)

### Шаг 1: Вынос модалки формы добавления

**Цель:** модальное окно «Добавить {entity}» — в отдельный компонент.

**Действия:**

1. Создать `ui/Add{Entity}Modal.tsx`
2. Перенести: Modal (через `ClosableModal`), форму, useForm, zod-схему
3. Props: `isOpen`, `onClose`, `onAdd{Entity}` — логика в хуке
4. В главной странице: удалить форму/модалку, добавить `<Add{Entity}Modal ... />`

**Managers:** [x] (`AddManagerModal`)  
**Owners:** [x] (`AddOwnerModal`)  
**Assignments:** [x] (`AssignPropertyModal`)  
**Properties:** [x] (`AddPropertyModal`, `EditPropertyModal`)

---

### Шаг 2: API-слайс

**Цель:** все запросы идут через локальную обёртку над `apiClient`.

**Действия:**

1. Создать `api/index.ts`
2. Экспортировать объект `{entity}Api` с методами-обёртками: `get{Entity}`, `create{Entity}` и т.д.
3. Внутри вызывать `apiClient.{method}`
4. В странице и хуках: заменить `apiClient` на `{entity}Api`

**Managers:** [x] (`managersApi`)  
**Owners:** [x] (`ownersApi`)  
**Assignments:** [x] (`assignmentsApi`)  
**Properties:** [x] (`propertiesApi`)

---

### Шаг 3: Хук use{Entity} (стейт и загрузка)

**Цель:** вынести работу со стейтом в кастомный хук.

**Действия:**

1. Создать `model/use{Entity}.ts`
2. Перенести: данные, `isLoading`, `fetch`, `add`, `delete` (если есть), `useDisclosure`
3. Хук возвращает объект со всеми нужными значениями и функциями
4. Страница использует хук, таблица и модалка — только рендер

**Managers:** [x] (`useManagers`)  
**Owners:** [x] (`useOwners`)  
**Assignments:** [x] (`useAssignments`)  
**Properties:** [x] (`useProperties`)

---

### Шаг 4: Вынос ActionsCell в ui (если есть удаление)

**Цель:** ячейка действий таблицы (кнопки удаления) — отдельный компонент.

**Действия:**

1. Создать `ui/Remove{Entity}Cell.tsx` (если у сущности есть удаление)
2. Props: `row`, `onDelete(id, name) => Promise<void>`, loading внутри компонента
3. `IconButton` с `DeleteIcon`
4. В `createColumns` использовать новый компонент

**Managers:** [x] (`RemoveManagerCell`)  
**Owners:** [—] нет удаления в текущем UI  
**Assignments:** [x] (`UnassignCell` — иконка крестик)  
**Properties:** [x] (`PropertyActionsCell` — Редактировать + DeleteIcon)

---

### Шаг 5: Shared Table compound component

**Цель:** перевести страницу на единый compound-компонент `Table` из `@/shared/ui/Table`.

**Структура Table:**

- `Table` — корень, провайдер контекста (`hasData`, `isLoading`, `loadingFallback`)
- `Table.EmptyFallback` — пустое состояние с кнопкой «Добавить» (props: `addText`, `addAction`)
- `Table.Card` — карточка с заголовком, иконкой «+» и таблицей (props: `title`, `table`, `onAddClick`, `size?`)
- `Table.List` — рендер Chakra Table по TanStack Table (используется внутри `Table.Card`)

**Действия:**

1. Импортировать `Table` из `@/shared/ui/Table`
2. Структура: `<Table hasData={...} isLoading={...}>` + `Table.EmptyFallback` + `Table.Card`
3. Удалить локальные Card, Thead/Tbody, обёртки — всё через `Table`

**Managers:** [x]  
**Owners:** [x]  
**Assignments:** [x]  
**Properties:** [x]

---

## Страницы для рефакторинга

- **managers** — шаги 1–5 выполнены
- **owners** — шаги 1–3, 5 выполнены (шаг 4 — без RemoveCell, удаления нет)
- **assignments** — шаги 1–5 выполнены
- **properties** — шаги 1–5 выполнены
