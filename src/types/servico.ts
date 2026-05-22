export interface Servico {
	id: number;
	nome: string;
	slug: string;
	valor: number;
	descricao: string | null;
	resumo: string | null;
	caminho_imagens: string;
	quantidade_imagens: number;
	prioridade: number;
	status_venda: boolean;
	criado_em: string;
	atualizado_em: string;
}

export interface CriarServicoInput {
	nome: string;
	valor: number;
	descricao?: string;
	resumo?: string;
	quantidade_imagens: number;
	prioridade?: number;
	status_venda?: boolean;
}

export interface AtualizarServicoInput {
	nome?: string;
	valor?: number;
	descricao?: string;
	resumo?: string;
	caminho_imagens?: string;
	quantidade_imagens?: number;
	prioridade?: number;
	status_venda?: boolean;
}

export interface ReordenarItem {
	id: number;
	prioridade: number;
}
