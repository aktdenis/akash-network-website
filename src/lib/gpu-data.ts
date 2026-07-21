export type GpuSpec = { label: string; value: string };

export type PricingRow = {
  provider: string;
  tier: string;
  price: string;
  vsAkash: string;
  verified: string;
};

export type DecisionCard = {
  heading: string;
  points: string[];
  link: { label: string; href: string };
};

export type UseCase = {
  title: string;
  description: string;
  framework: string;
};

export type FaqItem = { question: string; answer: string };

export type GpuComparison = {
  title: string;
  points: string[];
  link: { label: string; href: string };
};

export type RelatedGpu = {
  name: string;
  description: string;
  href: string;
};

export type GpuData = {
  slug: string;
  name: string;
  subtitle: string;
  specPills: string[];
  startingPrice: string;
  priceNote: string;
  quickSpecs: GpuSpec[];
  pricingTable: PricingRow[];
  decisionCards: DecisionCard[];
  deployYaml: string;
  deploySteps: { html: string }[];
  fullSpecs: GpuSpec[];
  comparisons: GpuComparison[];
  useCases: UseCase[];
  faq: FaqItem[];
  relatedGpus: RelatedGpu[];
  consoleUrl: string;
};

export const gpuData: Record<string, GpuData> = {
  rtx5090: {
    slug: "rtx5090",
    name: "NVIDIA GeForce RTX 5090",
    subtitle:
      "Blackwell-generation GPU for inference, fine-tuning, and image generation",
    specPills: ["32 GB GDDR7", "Blackwell GB202", "21,760 CUDA cores", "575 W TDP"],
    startingPrice: "$0.71/hr",
    priceNote: "No platform markup — you pay provider bids directly",
    quickSpecs: [
      { label: "Architecture", value: "Blackwell GB202" },
      { label: "VRAM", value: "32 GB GDDR7" },
      { label: "Memory bandwidth", value: "1,792 GB/s" },
      { label: "CUDA cores", value: "21,760" },
      { label: "Tensor cores", value: "3,352 (5th gen)" },
      { label: "TDP", value: "575 W" },
      { label: "NVLink", value: "No" },
      { label: "PCIe", value: "Gen 5 ×16" },
      { label: "CUDA capability", value: "12.0" },
    ],
    pricingTable: [
      {
        provider: "Akash",
        tier: "Marketplace baseline",
        price: "from $0.71",
        vsAkash: "—",
        verified: "Live",
      },
      {
        provider: "RunPod",
        tier: "Community Cloud",
        price: "$0.69",
        vsAkash: "~same",
        verified: "July 2025",
      },
      {
        provider: "RunPod",
        tier: "Secure Cloud",
        price: "$0.99",
        vsAkash: "+39%",
        verified: "July 2025",
      },
      {
        provider: "Vast.ai",
        tier: "Spot",
        price: "verify",
        vsAkash: "—",
        verified: "verify",
      },
      {
        provider: "Lambda Labs",
        tier: "On-demand",
        price: "verify",
        vsAkash: "—",
        verified: "verify",
      },
    ],
    decisionCards: [
      {
        heading: "Pick RTX 5090 if",
        points: [
          "Running inference for 7B–30B models",
          "LoRA fine-tuning on a budget",
          "Image generation with Stable Diffusion 3.5 or FLUX",
          "You need 32 GB VRAM at the lowest $/hr",
        ],
        link: { label: "View RTX 5090 pricing", href: "/pricing/gpus" },
      },
      {
        heading: "Pick RTX 4090 instead if",
        points: [
          "Your workload fits in 24 GB VRAM",
          "Cost is the top priority",
          "Provider availability matters more than raw throughput",
        ],
        link: { label: "View RTX 4090 pricing", href: "/pricing/gpus" },
      },
      {
        heading: "Pick H100 instead if",
        points: [
          "Running 70B+ parameter models",
          "You need NVLink or ECC memory",
          "Production-grade reliability is required",
        ],
        link: { label: "View H100 pricing", href: "/pricing/gpus" },
      },
    ],
    deployYaml: `version: "2.0"
services:
  vllm:
    image: vllm/vllm-openai:latest
    env:
      - MODEL_ID=Qwen/Qwen2.5-14B-Instruct
    expose:
      - port: 8000
        as: 80
        to:
          - global: true
profiles:
  compute:
    vllm:
      resources:
        cpu:
          units: 8
        memory:
          size: 32Gi
        storage:
          size: 100Gi
        gpu:
          units: 1
          attributes:
            vendor:
              nvidia:
                - model: rtx5090
  placement:
    akash:
      pricing:
        vllm:
          denom: uakt
          amount: 1000
deployment:
  vllm:
    akash:
      profile: vllm
      count: 1`,
    deploySteps: [
      {
        html: 'Open <a href="https://console.akash.network" class="underline underline-offset-2 hover:text-foreground transition-colors">console.akash.network</a>.',
      },
      {
        html: "Paste the SDL above into the deployment editor and click <strong>Deploy</strong>.",
      },
      {
        html: "Fund the escrow, wait for provider bids, and accept one. Your endpoint is live within minutes.",
      },
    ],
    fullSpecs: [
      { label: "Architecture", value: "Blackwell GB202" },
      { label: "Process node", value: "TSMC 4N" },
      { label: "VRAM", value: "32 GB GDDR7" },
      { label: "Memory bandwidth", value: "1,792 GB/s" },
      { label: "Memory bus", value: "512-bit" },
      { label: "CUDA cores", value: "21,760" },
      { label: "Tensor cores (5th gen)", value: "3,352" },
      { label: "RT cores", value: "170" },
      { label: "Base clock", value: "2.01 GHz" },
      { label: "Boost clock", value: "2.41 GHz" },
      { label: "TDP", value: "575 W" },
      { label: "NVLink", value: "No" },
      { label: "PCIe", value: "Gen 5 ×16" },
      { label: "CUDA capability", value: "12.0" },
      { label: "FP32 performance", value: "~105 TFLOPS" },
      { label: "FP16 (Tensor)", value: "~838 TFLOPS" },
      { label: "INT8 (Tensor)", value: "~1,676 TOPS" },
      { label: "Display outputs", value: "HDMI 2.1, 3× DisplayPort 2.1" },
      { label: "Form factor", value: "PCIe (consumer)" },
      { label: "ECC memory", value: "No" },
    ],
    comparisons: [
      {
        title: "RTX 5090 vs RTX 4090",
        points: [
          "33% more VRAM: 32 GB vs 24 GB",
          "Memory bandwidth nearly doubles: 1,792 vs 1,008 GB/s",
          "5th-gen Tensor cores vs 4th-gen",
          "Higher TDP: 575 W vs 450 W",
        ],
        link: { label: "View RTX 4090 pricing", href: "/pricing/gpus" },
      },
      {
        title: "RTX 5090 vs A100",
        points: [
          "A100 is data-center grade with ECC and NVLink",
          "RTX 5090 offers similar VRAM at a lower $/hr",
          "A100 scales better across multi-GPU setups",
          "RTX 5090 wins for single-GPU inference budgets",
        ],
        link: { label: "View A100 pricing", href: "/pricing/gpus" },
      },
      {
        title: "RTX 5090 vs H100",
        points: [
          "H100 has 80 GB HBM3 vs 32 GB GDDR7",
          "H100 supports NVLink and ECC memory",
          "H100 is purpose-built for large-scale training",
          "RTX 5090 is more affordable for 7B–30B inference",
        ],
        link: { label: "View H100 pricing", href: "/pricing/gpus" },
      },
    ],
    useCases: [
      {
        title: "LLM inference (7B–30B models)",
        description:
          "Run Llama 3, Qwen 2.5, Mistral, and similar models with vLLM or llama.cpp. 32 GB handles most 14B models at full precision.",
        framework: "vLLM · llama.cpp",
      },
      {
        title: "LoRA & QLoRA fine-tuning",
        description:
          "Fine-tune 7B–13B models with Axolotl or Hugging Face PEFT. QLoRA brings 30B+ models within reach of a single RTX 5090.",
        framework: "Axolotl · HF PEFT",
      },
      {
        title: "Image generation",
        description:
          "Run FLUX.1, Stable Diffusion 3.5, and ComfyUI pipelines. 32 GB provides ample headroom for high-resolution generation.",
        framework: "ComfyUI · Diffusers",
      },
      {
        title: "Development & evaluation",
        description:
          "Prototype models, run evals, and iterate on datasets without committing to long-term contracts. Pay by the hour.",
        framework: "PyTorch · Jupyter",
      },
    ],
    faq: [
      {
        question: 'What does "starting at $0.71/hr" mean?',
        answer:
          "Akash is a decentralized marketplace. Providers post bids and you pay the lowest accepted bid. The $0.71/hr figure is the minimum bid seen on the network — actual prices vary by provider and availability.",
      },
      {
        question: "Is the RTX 5090 suitable for production workloads?",
        answer:
          "Yes for many workloads. It lacks ECC memory and NVLink, which matters for large multi-GPU training runs. For inference, fine-tuning, and image generation it is production-ready.",
      },
      {
        question: "Can I run 70B+ models on an RTX 5090?",
        answer:
          "With quantization (GGUF Q4/Q5) you can run 70B models on 32 GB, but at reduced throughput. For full-precision 70B inference, consider renting an H100 or two RTX 5090s.",
      },
      {
        question: "How does Akash differ from RunPod or Vast.ai?",
        answer:
          "Akash is fully decentralized — providers are independent operators bidding on your deployment. There is no central platform markup. Pricing is transparent and competitive.",
      },
      {
        question: "Does the RTX 5090 support NVLink?",
        answer:
          "No. Consumer GeForce cards do not include NVLink. For multi-GPU workloads that require tight coupling, look at H100 or A100 SXM configurations.",
      },
      {
        question: "How do I pay on Akash?",
        answer:
          "Akash uses AKT (its native token) and USDC for payments. You fund an escrow account and pay as you use compute — no upfront commitment required.",
      },
    ],
    relatedGpus: [
      {
        name: "RTX 4090",
        description: "24 GB GDDR6X · Ada Lovelace · most-available consumer GPU on Akash",
        href: "/pricing/gpus",
      },
      {
        name: "A100",
        description: "80 GB HBM2e · Ampere · data-center grade with ECC",
        href: "/pricing/gpus",
      },
      {
        name: "H100",
        description: "80 GB HBM3 · Hopper · best for large-scale training",
        href: "/pricing/gpus",
      },
      {
        name: "H200",
        description: "141 GB HBM3e · Hopper · maximum VRAM on Akash",
        href: "/pricing/gpus",
      },
    ],
    consoleUrl: "https://console.akash.network",
  },
};
