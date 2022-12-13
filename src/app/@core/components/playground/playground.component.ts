import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDistance, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit {
  private resp: any = [];


  // badges
  chip = {
    show: false,
    description: 'Em Breve',
    color: '#ff9036',
  };

  // Blank state
  title = 'Nenhum espaço adicionado ao acordo';
  icon = 'fa-light fa-chart-mixed';
  text = 'Clique no botão abaixo para adicionar espaços a esse acordo';
  outlinedBtnLabel = 'Adicionar espaço';
  raisedBtnLabel = 'Cancelar';
  outlinedIcon = 'fa-light fa-plus';
  raisedIcon = 'fa-light fa-xmark';

  //Tabbuttons
  label = 'button';
  value = '9999';
  borderColor = '#075952';
  textColor = '#075952';
  bgColor = '#148735';

  //Btn raidsed
  labelRaised = 'button';
  disabled = false;
  color = 'primary';
  large = true;
  iconRaised = {
    show: true,
    label: 'fa-light fa-store',
    position: 'right',
  };

  //btn link
  link = {
    path: '/',
    label: 'Texto do botão link',
  };

  // btnDropdown
  btnType = 'raised';

  //CardHub
  item = {
    router: '/',
    badge: {
      router: '',
      bgColor: '#0b877d',
      width: '90px',
      chip: {
        show: false,
        description: 'Em Breve',
        color: '#ff9036',
      },
      icon: 'fa fa-store',
    },
    title: 'Espaços',
    description:
      'Cadastre aqui o endereço dos tipos de espaços dentro de cada loja',
  };
  router = '/';
  badge = {
    router: '',
    bgColor: '#0b877d',
    width: '90px',
    chip: {
      show: false,
      description: 'Em Breve',
      color: '#ff9036',
    },
    icon: 'fa fa-store',
  };
  titleHub = 'Espaços';
  description =
    'Cadastre aqui o endereço dos tipos de espaços dentro de cada loja';

  // Cards
  public cardContent = [
    {
      title: 'Nome do card',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      title: 'Nome do card',
      subtitle: '7891234567890',
      storeName: 'Nome da Loja',
      storeIcon: 'fa-solid fa-store',
    },
    {
      title: 'Ofertas Verão 2021',
      subtitle: '0 de 18 ofertas adicionadas',
      campaingCardType: true,
      statusColor: '#1AAA42',
      statusObject: {
        label: 'Definição até',
        date: new Date(),
      },
      actions: {
        menu: [
          {
            icon: 'fa-solid fa-print',
            label: 'Imprimir',
          },
          {
            icon: 'fa-solid fa-file-arrow-down',
            label: 'Baixar',
          },
          {
            icon: 'fa-solid fa-envelope',
            label: 'Enviar',
          },
        ],
      },
      chips: [
        {
          label: '0/4',
          icon: 'fa-solid fa-store',
        },
        {
          label: '08',
          icon: 'fa-solid fa-store',
        },
        {
          label: '03',
          icon: 'fa-solid fa-store',
        },
      ],
    },
    {
      image: 'NO_IMAGE_TO_SHOW',
      title: 'Nome do card',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      image: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      title: 'Nome do card',
      button: {
        label: 'Primario',
        color: 'primary',
      },
    },
    {
      image: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      title: 'Nome do card',
      chips: [
        {
          label: 'Template de Cartaz',
          color: 'primary',
        },
        {
          label: 'A4V',
          color: 'accent',
        },
        {
          label: 'Template de Cartaz',
          color: 'warn',
        },
      ],
    },
    {
      image: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      title: 'Nome do card',
      actions: {
        slide: {
          checked: false,
          label: 'Ativo',
        },
        menu: [
          {
            icon: 'fa-light fa-print',
            label: 'Imprimir',
          },
          {
            icon: 'fa-light fa-file-arrow-down',
            label: 'Baixar',
          },
          {
            icon: 'fa-light fa-envelope',
            label: 'Enviar',
          },
        ],
      },
    },
    {
      image: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
      title: 'Nome do card',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      chips: [
        {
          label: 'Template de Cartaz',
          color: 'primary',
        },
        {
          label: 'A4V',
          color: 'primary',
        },
        {
          label: 'Template de Cartaz',
          color: 'primary',
        },
      ],
      lastUpdate: {
        text: 'atualizado',
        data: formatDistance(subDays(new Date(), 3), new Date(), {
          addSuffix: true,
          locale: ptBR,
        }),
      },
      actions: {
        slide: {
          checked: false,
          label: 'Ativo',
        },
        menu: [
          {
            icon: 'fa-light fa-print',
            label: 'Imprimir',
          },
          {
            icon: 'fa-light fa-file-arrow-down',
            label: 'Baixar',
          },
          {
            icon: 'fa-light fa-envelope',
            label: 'Enviar',
          },
        ],
      },
    },
  ];

  //chips
  iconChips = 'fa-light fa-xmark';

  //comments
  iconComments = 'fa-light fa-comment';
  comments = [
    {
      icon: 'GC',
      name: 'João Amaral',
      date: new Date(),
      comment: 'Não esquecer de enviar prova',
    },
    {
      icon: 'GC',
      name: 'João Amaral',
      date: new Date(),
      comment: 'Não esquecer de enviar prova',
    },
  ];

  // loader
  brand =
    'https://uploads-ssl.webflow.com/603001e2efe8115ace2bc255/6281032c7ec579b1dc437e30_logoNovo-13.png';

  // dialog
  modelDialog = false;

  // Inputs examples
  public inputs = [
    {
      id: 0,
      mask: '00000-000',
      label: 'Teste Mask',
      type: 'mask',
      control: 'mask',
      hint: 'texto de ajuda',
      iconTooltip: 'fa-solid fa-circle-info',
      infoTooltip: 'tooltip teste',
      disabled: false,
    },
    {
      id: 1,
      label: 'Teste text',
      type: 'text',
      control: 'text',
      icon: 'fa-light fa-calendar-circle-plus',
      placeholder: 'teste',
      disabled: false,
      hint: 'texto de ajuda',
      maxlength: 3,
      iconTooltip: 'fa-solid fa-circle-info',
      infoTooltip: 'tooltip teste',
    },
    {
      id: 2,
      label: 'Teste Currency',
      type: 'currency',
      control: 'currency',
      hint: 'texto de ajuda',
      currencyOptions: { prefix: 'R$ ', thousands: '.', decimal: ',' },
      disabled: false,
      iconTooltip: 'fa-solid fa-circle-info',
      infoTooltip: 'tooltip teste',
    },
  ];

  // inputs form
  public formAtribute: FormGroup = new FormGroup({
    mask: new FormControl({ value: null, disabled: this.inputs[0].disabled }, [
      Validators.required,
    ]),
    text: new FormControl({ value: null, disabled: this.inputs[1].disabled }, [
      Validators.required,
    ]),
    currency: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    select: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    select1: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    textarea: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    calendar: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    calendar1: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    calendar2: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    startData: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    endData: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    checked1: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    checked2: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    radio: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    switch: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
    counter: new FormControl({ value: null, disabled: false }, [
      Validators.required,
    ]),
  });

  // calendar
  todayDate: Date = new Date();
  startDate: Date = new Date();

  // Radios
  itemsRadio: any = ['Winter', 'Spring', 'Summer', 'Autumn'];

  // select input
  public selected: any = [];
  public selectList: any[] = [
    { key: 0, value: 'Debito em conta' },
    { key: 1, value: 'Desconto em fatura' },
    { key: 2, value: 'Boleto bancário' },
    { key: 3, value: 'Pedido bonificado' },
  ];

  // notifications
  notificationModel = false;
  public notifications = {
    icon: 'fa-light fa-voicemail',
    title: 'Criar nova oferta',
    text: 'Uma nova oferta será gerada no sistema',
    primaryColor: '#0B877D',
    buttons: {
      primaryButton: {
        label: 'cancelar',
        color: 'primary',
        large: true,
      },
      secondaryButton: {
        label: 'Excluir',
        color: 'primary',
        large: true,
        icon: {
          show: true,
          label: 'arrow_forward',
          position: 'left',
        },
      },
    },
  };

  //snackbar
  snackbarFake = false;
  // snackbar
  snackbarSuccess = false;
  snackbarWarn = false;
  snackbarError = true;
  snackbarInfo = false;

  // superCard
  selectTab: any = {
    component: 'agreement',
  };
  model = false;

  // menus
  menuItems: any = [
    {
      icon: 'fa-light fa-print',
      label: 'Imprimir',
    },
    {
      icon: 'fa-light fa-file-arrow-down',
      label: 'Baixar',
    },
    {
      icon: 'fa-light fa-envelope',
      label: 'Enviar',
    },
    {
      icon: 'fa-light fa-copy',
      label: 'Clonar',
    },
    {
      icon: 'fa-light fa-trash-can',
      label: 'Excluir',
    },
  ];

  // Table
  displayedColumns: string[] = [
    'checkbox',
    'codigo',
    'line',
    'description',
    'status',
    'statusChip',
    'value',
    'date',
    'actions',
  ];
  tableColumns = [
    {
      columnDef: 'checkbox',
      header: 'Checkbox',
      cell: (element: any) => `${element.codigo}`,
    },
    {
      columnDef: 'codigo',
      header: 'Código',
      cell: (element: any) => `${element.codigo}`,
    },
    {
      columnDef: 'line',
      header: 'Linha',
      cell: (element: any) => `${element.line}`,
    },
    {
      columnDef: 'description',
      header: 'Descrição',
      cell: (element: any) => `${element.description}`,
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (element: any) => `${element.status}`,
    },
    {
      columnDef: 'statusChip',
      header: 'Status',
      cell: (element: any) => element.statusChip,
    },
    {
      columnDef: 'value',
      header: 'Valor',
      cell: (element: any) => `${element.value}`,
    },
    {
      columnDef: 'date',
      header: 'Vigência',
      cell: (element: any) => element.date,
    },
    {
      columnDef: 'actions',
      header: 'Ações',
      cell: (element: any) => element.actions,
    },
  ];

  tableItems = [
    {
      codigo: '01',
      line: 'Linha 01',
      description: 'Descrição',
      status: 'Tipo',
      statusChip: {
        label: 'Exemplo',
        color: '',
      },
      value: 1000.0,
      date: {
        start: new Date(),
        end: new Date(),
      },
      actions: [
        {
          type: 'comments',
          icon: 'fa-light fa-comment',
          comments: [
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
          ],
        },
        {
          icon: 'fa-light fa-trash-can',
          action: 'delete',
        },
      ],
    },
    {
      codigo: '02',
      line: 'Linha 02',
      description: 'Descrição',
      status: 'Tipo',
      statusChip: {
        label: 'Exemplo',
        color: 'primary',
      },
      value: 1000.0,
      date: {
        start: new Date(),
        end: new Date(),
      },
      actions: [
        {
          type: 'comments',
          icon: 'fa-light fa-comment',
          comments: [
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
          ],
        },
        {
          icon: 'fa-light fa-trash-can',
          action: 'delete',
        },
      ],
    },
    {
      codigo: '03',
      line: 'Linha 03',
      description: 'Descrição',
      status: 'Tipo',
      statusChip: {
        label: 'Exemplo',
        color: 'accent',
      },
      value: 1000.0,
      date: {
        start: new Date(),
        end: new Date(),
      },
      actions: [
        {
          type: 'comments',
          icon: 'fa-light fa-comment',
          comments: [
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
          ],
        },
        {
          icon: 'fa-light fa-trash-can',
          action: 'delete',
        },
      ],
    },
    {
      codigo: '04',
      line: 'Linha 04',
      description: 'Descrição',
      status: 'Tipo',
      statusChip: {
        label: 'Exemplo',
        color: 'warn',
      },
      value: 1000.0,
      date: {
        start: new Date(),
        end: new Date(),
      },
      actions: [
        {
          type: 'comments',
          icon: 'fa-light fa-comment',
          comments: [
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
          ],
        },
        {
          icon: 'fa-light fa-trash-can',
          action: 'delete',
        },
      ],
    },
    {
      codigo: '04',
      line: 'Linha 04',
      description: 'Descrição',
      status: 'Tipo',
      statusChip: {
        label: 'Exemplo',
        color: 'warn',
      },
      value: 1000.0,
      date: {
        start: new Date(),
        end: new Date(),
      },
      actions: [
        {
          type: 'comments',
          icon: 'fa-light fa-comment',
          comments: [
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
          ],
        },
        {
          icon: 'fa-light fa-trash-can',
          action: 'delete',
        },
      ],
    },
    {
      codigo: '04',
      line: 'Linha 04',
      description: 'Descrição',
      status: 'Tipo',
      statusChip: {
        label: 'Exemplo',
        color: 'warn',
      },
      value: 1000.0,
      date: {
        start: new Date(),
        end: new Date(),
      },
      actions: [
        {
          type: 'comments',
          icon: 'fa-light fa-comment',
          comments: [
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
            {
              icon: 'GC',
              name: 'João Amaral',
              date: new Date(),
              comment: 'Não esquecer de enviar prova',
            },
          ],
        },
        {
          icon: 'fa-light fa-trash-can',
          action: 'delete',
        },
      ],
    },
  ];

  //tab items
  tabsItems = [
    {
      label: 'Acordo',
      component: 'agreement',
      text: '',
      icon: 'fa-solid fa-handshake-simple',
    },
    {
      label: 'Atividades',
      component: 'activities',
      text: '',
      icon: 'fa-light fa-clipboard-list-check',
    },
    {
      label: 'Comentários',
      component: 'comments',
      text: '',
      icon: 'fa-light fa-comments',
    },
    {
      label: 'Anexos',
      component: 'attachment',
      text: '',
      icon: 'fa-light fa-link',
    },
    {
      label: 'Histórico',
      component: 'history',
      text: '',
      icon: 'fa-light fa-clock-rotate-left',
    },
  ];

  // Add todo
  newItemName!: string;
  items: any = [...new Array(10)].map((_, index) => ({
    id: index + 1,
    isDone: false,
    title: `Todo ${index + 1}`,
  }));

  constructor(
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.snackbarWarn = true;
    }, 5000);

    setTimeout(() => {
      this.snackbarSuccess = true;
    }, 10000);

    setTimeout(() => {
      this.snackbarInfo = true;
    }, 15000);
  }

  actionTableClick($event: any) {
    if ($event.men === 'delete') {
      console.log('delete');
    }
  }

  changeValueComment($event: any) {
    console.log($event);
  }

  onSelectedItems($event: any) {
    console.log($event);
  }

  changeDate($event: any) {
    console.log($event);
  }

  changeDateRange($event: any) {
    this.formAtribute.controls['calendar2'].setValue($event);
  }

  openDialog() {
    debugger
    this.model = !this.model;
  }

  closeDialog() {
    this.model = !this.model;
  }

  openNotification() {
    this.notificationModel = !this.notificationModel;
  }

  notificationEvent() {
    console.log('notification click');
    this.notificationModel = !this.notificationModel;
  }

  cardButtonClick() {
    console.log('click card');
  }

  onCardMenu($event: any) {
    console.log($event);
  }

  onSlideClick($event: any) {
    console.log($event);
  }
  onMenuClick($event: any): void {
    console.log($event);
  }

  onSelectEvent($event: any) {
    console.log(this.formAtribute);
    this.selected = $event;
  }

  // Inputs example
  onBlurEvent($event: any): void {
    console.log(this.formAtribute);
    console.log($event);
  }

  onFocusEvent($event: any): void {
    console.log($event);
  }

  childEventClicked(event: any): void {
    console.log(event);
  }

  onSuperCardTabClick($event: any) {
    console.log('clicou', $event);
    this.selectTab = $event;
  }

  onClick($event: any) {
    console.log($event);
  }

  changeComment($event: any) {
    console.log($event);
  }

  onCroped(event: any) {
    console.log(event)
  }
}
