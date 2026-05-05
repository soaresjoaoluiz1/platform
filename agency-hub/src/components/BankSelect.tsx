export const BANCOS = [
  'Bradesco',
  'Itaú',
  'Nubank',
  'Inter',
  'Caixa Econômica',
  'Banco do Brasil',
  'Santander',
  'Sicoob',
  'Sicredi',
  'BTG Pactual',
  'C6 Bank',
  'PicPay',
  'Pagseguro',
  'Mercado Pago',
  'Dinheiro / Caixa',
]

export default function BankSelect({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <>
      <input
        className="input"
        list="banks-datalist"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Selecionar ou digitar banco'}
        autoComplete="off"
      />
      <datalist id="banks-datalist">
        {BANCOS.map(b => <option key={b} value={b} />)}
      </datalist>
    </>
  )
}
