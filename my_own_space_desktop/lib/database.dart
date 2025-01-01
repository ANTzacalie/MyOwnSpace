import 'package:sqlite3/sqlite3.dart';
import 'package:path_provider/path_provider.dart';

class DatabaseHelper {

  // Here we fist create the instance of the database_helper
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  factory DatabaseHelper() => _instance;

  // database variable declaration as static , because it dose not need to change on hole app_lifecycle
  static Database? _database;

  DatabaseHelper._internal();

  // Runs when the DatabaseHelper is first open
  Future<Database> get database async {

    if (_database != null) {

      return _database!;

    }

    _database = await _initDatabase();

    return _database!;

  }

  Future<Database> _initDatabase() async {

    final directory = await getApplicationDocumentsDirectory();
    final dbPath = '${directory.path}/app_database.db'; // Database file path

    final db = sqlite3.open(dbPath); // Open SQLite database at the specified path

    db.execute('''
       CREATE TABLE IF NOT EXISTS user (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           SESSION_ID TEXT NOT NULL,
           ADDRESS TEXT NOT NULL
       )
    ''');


    return db;

  }

  // Insert a user into the database
  Future<void> insertUser(String sessionId, String address) async {

    final db = await database;

    const query = "INSERT INTO user (SESSION_ID, ADDRESS) VALUES (?, ?)";
    db.execute(query, [sessionId, address]);

  }

  // Get all files from the database
  Future<List<Map<String, dynamic>>?> getAllFiles() async {

    final db = await database;

    const query = "SELECT * FROM main";
    final result = db.select(query);

    return result.isNotEmpty ? result : null;

  }

  // Get user credentials from the database
  Future<List<Map<String, dynamic>>?> getUserCredentials() async {

    final db = await database;

    const query = "SELECT * FROM user ORDER BY id DESC";
    final result = db.select(query);

    return result.isNotEmpty ? result : null;

  }

  // Delete all data (drop tables)
  Future<void> deleteAll() async {

    final db = await database;

    db.execute('DROP TABLE IF EXISTS user');
  }

}

