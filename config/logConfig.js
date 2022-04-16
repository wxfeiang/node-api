const log4js = require('log4js')

log4js.configure({
  replaceConsole: true, // 替换console.log
  appenders: {
    stdout: {
      //控制台输出
      type: 'stderr' // 该条日志将同时被输出到 stdout（控制台）
    },
    // 配置打印输出源
    // trace: {
    //   type: 'console', // 控制台打印日志
    //   // type: "file", // 表示日志输出为普通文件，在此种配置下日志会输出到目标文件夹的目标文件中，并会随着文件大小的变化自动份文件
    //   // type: "dateFile", // 表示是输出按时间分文件的日志，在此种配置下,日志会输出到目标目录下，并以时间格式命名，随着时间的推移，以时间格式命名的文件如果尚未存在，则自动创建新的文件.
    //   // compress: true, //（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
    //   // maxLogSize: 10000000, // 文件最大存储空间,单位是字节,只在type: file模式有效,表示文件多大时才会创建下一个文件（ xxx.log .1 之类）
    //   filename: path.join(__dirname, '/logger/logs', 'trace', 'trace'), // 写入日志文件的路径
    //   pattern: 'yyyy-MM-dd.log', //确定何时滚动日志的模式,只在type: dateFile模式有效,(默认为.yyyy-MM-dd0),表示一个文件的时间命名模式,格式:.yyyy-MM-dd-hh:mm:ss.log,在生成文件中会依照pattern配置来在filename的文件结尾追加一个时间串来命名文件。
    //   encoding: 'utf-8', // default "utf-8"，文件的编码
    //   alwaysIncludePattern: true //将模式包含在当前日志文件的名称以及备份中,只在type: dateFile模式有效,(默认为false),配置为ture即最终的日志路径文件名为filename + pattern
    //   //backups： 只在type: file模式有效,表示备份的文件数量,如果文件过多则会将最旧的删除。
    // },

    req: {
      //请求日志
      type: 'dateFile',
      filename: 'logs/reqlog/',
      maxLogSize: 1024 * 500, //一个文件的大小，超出后会自动新生成一个文件
      backups: 2, // 备份的文件数量
      pattern: 'req-yyyy-MM-dd.log',
      encoding: 'utf-8', // default "utf-8"，文件的编码
      alwaysIncludePattern: true
    },
    err: {
      //错误日志
      type: 'dateFile',
      filename: 'logs/errlog/',
      maxLogSize: 1024 * 500, //一个文件的大小，超出后会自动新生成一个文件
      backups: 2, // 备份的文件数量
      pattern: 'err-yyyy-MM-dd.log',
      encoding: 'utf-8', // default "utf-8"，文件的编码
      alwaysIncludePattern: true
    },
    oth: {
      //其他日志
      type: 'dateFile',
      filename: 'logs/othlog/',
      maxLogSize: 1024 * 500, //一个文件的大小，超出后会自动新生成一个文件
      backups: 2, // 备份的文件数量
      pattern: 'oth-yyyy-MM-dd.log',
      encoding: 'utf-8', // default "utf-8"，文件的编码
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: { appenders: ['stdout', 'req'], level: 'debug' }, //appenders:采用的appender,取appenders项,level:设置级别
    err: { appenders: ['stdout', 'err'], level: 'error' },
    oth: { appenders: ['stdout', 'oth'], level: 'info' }
  },
  pm2: true, // 使用 pm2 来管理项目时，打开
  pm2InstanceVar: 'INSTANCE_ID' // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
})

exports.getLogger = function (name) {
  //name取categories项
  return log4js.getLogger(name || 'default')
}

exports.useLogger = function (app, logger) {
  //用来与express结合
  app.use(
    log4js.connectLogger(logger || log4js.getLogger('default'), {
      format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]' //自定义输出格式
    })
  )
}
